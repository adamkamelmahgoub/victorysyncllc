
import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { users, passwordResets } from '../db/schema';
import argon2 from 'argon2';
import crypto from 'crypto';
import dayjs from 'dayjs';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password, admin } = req.body as { email: string; password: string; admin?: boolean };
    
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Invalid credentials' });
    }
    
    if (admin && !['admin', 'superAdmin'].includes(user.role || '')) {
      return res.status(403).json({ ok: false, message: 'Insufficient permissions' });
    }
    
    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      return res.status(401).json({ ok: false, message: 'Invalid credentials' });
    }
    
    // Update last login
    await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, user.id));
    
    // Set session or JWT (using existing auth mechanism)
    req.session = req.session || {};
    req.session.userId = user.id;
    req.session.userRole = user.role;
    
    return res.json({ 
      ok: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        fullName: user.fullName
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body as { email: string };
    
    const [user] = await db.select().from(users).where(eq(users.email, email));
    // Always respond with success to prevent user enumeration
    if (!user) {
      return res.json({ ok: true });
    }
    
    const rawToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = await argon2.hash(rawToken);
    const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
    const expiresAt = dayjs().add(30, 'minute').toDate();
    
    await db.insert(passwordResets).values({
      userId: user.id,
      tokenHash,
      otpCode: otp,
      expiresAt
    });
    
    // Log the reset info (replace with actual email service)
    console.log(`🔐 Password reset for ${email}`);
    console.log(`Reset link: ${process.env.APP_ORIGIN || 'http://localhost:5000'}/reset-password?token=${encodeURIComponent(rawToken)}`);
    console.log(`OTP: ${otp}`);
    
    return res.json({ ok: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

router.get('/reset-password/requirements', async (req, res) => {
  try {
    const token = String(req.query.token || '');
    
    // Check if token requires TOTP (for admin users with MFA)
    const resets = await db.select().from(passwordResets);
    for (const reset of resets) {
      try {
        const match = await argon2.verify(reset.tokenHash, token);
        if (match) {
          const [user] = await db.select().from(users).where(eq(users.id, reset.userId));
          if (user) {
            const requireTotp = ['admin', 'superAdmin'].includes(user.role || '') && user.mfaEnabled;
            return res.json({ requireTotp });
          }
        }
      } catch (e) {
        // Continue to next token
      }
    }
    
    return res.json({ requireTotp: false });
  } catch (error) {
    console.error('Reset requirements error:', error);
    return res.json({ requireTotp: false });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, otp, totp, password } = req.body as { 
      token: string; 
      otp: string; 
      totp?: string; 
      password: string; 
    };
    
    const now = new Date();
    const resets = await db.select().from(passwordResets);
    
    for (const reset of resets) {
      try {
        const match = await argon2.verify(reset.tokenHash, token);
        if (!match) continue;
        
        if (reset.usedAt || reset.expiresAt < now) {
          return res.status(400).json({ ok: false, message: 'Token expired or already used' });
        }
        
        if (reset.otpCode !== otp) {
          return res.status(400).json({ ok: false, message: 'Invalid verification code' });
        }
        
        const [user] = await db.select().from(users).where(eq(users.id, reset.userId));
        if (!user) {
          return res.status(400).json({ ok: false, message: 'User not found' });
        }
        
        // Check TOTP for admin users with MFA
        if (['admin', 'superAdmin'].includes(user.role || '') && user.mfaEnabled) {
          if (!totp) {
            return res.status(400).json({ ok: false, needTotp: true });
          }
          // In a real system, verify TOTP here
          if (process.env.ADMIN_TEST_TOTP && process.env.ADMIN_TEST_TOTP !== totp) {
            return res.status(400).json({ ok: false, message: 'Invalid TOTP code' });
          }
        }
        
        const newHash = await argon2.hash(password);
        await db.update(users)
          .set({ passwordHash: newHash, updatedAt: new Date() })
          .where(eq(users.id, user.id));
        
        await db.update(passwordResets)
          .set({ usedAt: new Date() })
          .where(eq(passwordResets.id, reset.id));
        
        return res.json({ ok: true });
      } catch (e) {
        // Continue to next reset
      }
    }
    
    return res.status(400).json({ ok: false, message: 'Invalid or expired token' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

export default router;
