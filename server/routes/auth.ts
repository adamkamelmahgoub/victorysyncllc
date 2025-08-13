
import { Router } from 'express';
import { z } from 'zod';
import argon2 from 'argon2';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { query } from '../db/index.js';
import { sign } from '../lib/jwt.js';
import { requireAuth } from '../middleware/auth.js';

export const auth = Router();

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development',
  sameSite: process.env.NODE_ENV !== 'development' ? 'strict' : 'lax',
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
} as const;

// Login
auth.post('/auth/login', async (req, res) => {
  try {
    const { email, password, totpCode } = z.object({
      email: z.string().email(),
      password: z.string(),
      totpCode: z.string().optional(),
    }).parse(req.body);

    const user = await query`
      SELECT id, email, password_hash, role, two_factor_enabled, two_factor_secret, is_active
      FROM users WHERE email = ${email}
    `.then(rows => rows[0]);

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await argon2.verify(user.password_hash, password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check 2FA if enabled
    if (user.two_factor_enabled) {
      if (!totpCode) {
        return res.status(200).json({ requires2FA: true });
      }

      const validToken = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: totpCode,
        window: 1,
      });

      if (!validToken) {
        return res.status(401).json({ message: 'Invalid 2FA code' });
      }
    }

    const token = sign({ userId: user.id, email: user.email, role: user.role });
    res.cookie('vs_token', token, cookieOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: 'Invalid request' });
  }
});

// Register with access code
auth.post('/auth/register-with-code', async (req, res) => {
  try {
    const { code, email, phone, name, organization, password } = z.object({
      code: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      name: z.string(),
      organization: z.string(),
      password: z.string().min(8),
    }).parse(req.body);

    // Verify access code
    const accessCode = await query`
      SELECT * FROM access_codes 
      WHERE code = ${code} AND email = ${email} AND used = false
      AND (expires_at IS NULL OR expires_at > now())
    `.then(rows => rows[0]);

    if (!accessCode) {
      return res.status(400).json({ message: 'Invalid or expired access code' });
    }

    // Check if user already exists
    const existingUser = await query`
      SELECT id FROM users WHERE email = ${email}
    `.then(rows => rows[0]);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create organization if needed
    let org = await query`
      SELECT id FROM organizations WHERE name = ${organization}
    `.then(rows => rows[0]);

    if (!org) {
      org = await query`
        INSERT INTO organizations (name) VALUES (${organization})
        RETURNING id
      `.then(rows => rows[0]);
    }

    // Create user
    const passwordHash = await argon2.hash(password);
    const user = await query`
      INSERT INTO users (org_id, email, phone, full_name, password_hash, role)
      VALUES (${org.id}, ${email}, ${phone || null}, ${name}, ${passwordHash}, 'customer')
      RETURNING id, email, role
    `.then(rows => rows[0]);

    // Create user permissions
    await query`
      INSERT INTO user_permissions (user_id) VALUES (${user.id})
    `;

    await query`
      INSERT INTO user_payment_policies (user_id) VALUES (${user.id})
    `;

    // Mark access code as used
    await query`
      UPDATE access_codes SET used = true, used_at = now() WHERE id = ${accessCode.id}
    `;

    const token = sign({ userId: user.id, email: user.email, role: user.role });
    res.cookie('vs_token', token, cookieOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: 'Invalid request' });
  }
});

// Get current user
auth.get('/auth/me', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const user = await query`
      SELECT u.id, u.email, u.full_name, u.role, u.two_factor_enabled,
             o.name as organization
      FROM users u
      LEFT JOIN organizations o ON o.id = u.org_id
      WHERE u.id = ${userId}
    `.then(rows => rows[0]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2FA enrollment
auth.post('/auth/2fa/enroll', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const user = await query`
      SELECT email FROM users WHERE id = ${userId}
    `.then(rows => rows[0]);

    const secret = speakeasy.generateSecret({
      name: `VictorySync (${user.email})`,
      issuer: 'VictorySync',
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      otpauth_url: secret.otpauth_url,
    });
  } catch (error) {
    console.error('2FA enroll error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enable 2FA
auth.post('/auth/2fa/enable', requireAuth, async (req, res) => {
  try {
    const { secret, token } = z.object({
      secret: z.string(),
      token: z.string(),
    }).parse(req.body);

    const userId = (req as any).user.userId;

    const validToken = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!validToken) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    await query`
      UPDATE users 
      SET two_factor_enabled = true, two_factor_secret = ${secret}
      WHERE id = ${userId}
    `;

    res.json({ success: true });
  } catch (error) {
    console.error('2FA enable error:', error);
    res.status(400).json({ message: 'Invalid request' });
  }
});

// Disable 2FA
auth.post('/auth/2fa/disable', requireAuth, async (req, res) => {
  try {
    const { password, token } = z.object({
      password: z.string(),
      token: z.string().optional(),
    }).parse(req.body);

    const userId = (req as any).user.userId;
    const user = await query`
      SELECT password_hash, two_factor_secret FROM users WHERE id = ${userId}
    `.then(rows => rows[0]);

    const validPassword = await argon2.verify(user.password_hash, password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (token) {
      const validToken = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token,
        window: 1,
      });

      if (!validToken) {
        return res.status(400).json({ message: 'Invalid 2FA token' });
      }
    }

    await query`
      UPDATE users 
      SET two_factor_enabled = false, two_factor_secret = null
      WHERE id = ${userId}
    `;

    res.json({ success: true });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(400).json({ message: 'Invalid request' });
  }
});

// Logout
auth.post('/auth/logout', (_req, res) => {
  res.clearCookie('vs_token', { path: '/' });
  res.json({ success: true });
});
