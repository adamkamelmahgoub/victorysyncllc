
import express from 'express';
import argon2 from 'argon2';
import { z } from 'zod';
import { db } from '../db.js';
import { users, organizations, accessCodes, userRoles, roles } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { generateTokens, verifyToken, authenticateToken, AuthRequest } from '../lib/auth.js';
import { auditLog } from '../lib/audit.js';
import { encrypt, decrypt, generateTOTPSecret } from '../lib/crypto.js';
import * as OTPAuth from 'otpauth';

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerWithCodeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  accessCode: z.string().min(1),
});

const verify2FASchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user || !await argon2.verify(user.passwordHash, password)) {
      await auditLog({
        action: 'login_failed',
        entityType: 'user',
        entityId: email,
        meta: { reason: 'invalid_credentials' },
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      return res.status(401).json({
        ok: false,
        error: 'invalid_credentials',
        message: 'Invalid email or password'
      });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Don't generate full tokens yet, just return requires2FA
      return res.json({
        ok: true,
        requires2FA: true,
        email: user.email
      });
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      orgId: user.orgId,
      email: user.email,
      name: user.name,
      isSuperAdmin: user.isSuperAdmin,
      permissions: [], // Will be loaded by auth middleware
    });

    // Set httpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await auditLog({
      orgId: user.orgId,
      actorUserId: user.id,
      action: 'login_success',
      entityType: 'user',
      entityId: user.id.toString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        orgId: user.orgId,
        isSuperAdmin: user.isSuperAdmin,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      ok: false,
      error: 'server_error',
      message: 'Login failed'
    });
  }
});

// 2FA Verify
router.post('/2fa/verify', async (req, res) => {
  try {
    const { email, code } = verify2FASchema.parse(req.body);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_request',
        message: '2FA not enabled for this user'
      });
    }

    // Decrypt and verify TOTP
    const secret = decrypt(user.twoFactorSecret);
    const totp = new OTPAuth.TOTP({
      issuer: process.env.TOTP_ISSUER || 'VictorySync',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    });

    const isValid = totp.validate({
      token: code,
      window: 1, // Allow 1 step tolerance
    });

    if (isValid === null) {
      await auditLog({
        orgId: user.orgId,
        actorUserId: user.id,
        action: '2fa_failed',
        entityType: 'user',
        entityId: user.id.toString(),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });

      return res.status(401).json({
        ok: false,
        error: 'invalid_code',
        message: 'Invalid 2FA code'
      });
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      orgId: user.orgId,
      email: user.email,
      name: user.name,
      isSuperAdmin: user.isSuperAdmin,
      permissions: [], // Will be loaded by auth middleware
    });

    // Set httpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await auditLog({
      orgId: user.orgId,
      actorUserId: user.id,
      action: 'login_success_2fa',
      entityType: 'user',
      entityId: user.id.toString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        orgId: user.orgId,
        isSuperAdmin: user.isSuperAdmin,
      }
    });
  } catch (error) {
    console.error('2FA verify error:', error);
    res.status(500).json({
      ok: false,
      error: 'server_error',
      message: '2FA verification failed'
    });
  }
});

// Register with access code
router.post('/register-with-code', async (req, res) => {
  try {
    const { name, email, password, accessCode } = registerWithCodeSchema.parse(req.body);

    // Start transaction
    const result = await db.transaction(async (tx) => {
      // Verify access code
      const [code] = await tx
        .select()
        .from(accessCodes)
        .where(and(
          eq(accessCodes.code, accessCode),
          eq(accessCodes.status, 'active')
        ));

      if (!code) {
        throw new Error('Invalid or expired access code');
      }

      if (code.expiresAt < new Date()) {
        await tx
          .update(accessCodes)
          .set({ status: 'expired' })
          .where(eq(accessCodes.id, code.id));
        throw new Error('Access code has expired');
      }

      // Check if email already exists
      const [existingUser] = await tx
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUser) {
        throw new Error('Email already registered');
      }

      let orgId = code.orgId;

      // If no org assigned to code, create new org
      if (!orgId) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        const [newOrg] = await tx
          .insert(organizations)
          .values({
            name: `${name}'s Organization`,
            slug: `${slug}-${Date.now()}`,
            status: 'active',
          })
          .returning();

        orgId = newOrg.id;

        // Update access code with org
        await tx
          .update(accessCodes)
          .set({ orgId })
          .where(eq(accessCodes.id, code.id));
      }

      // Hash password and create user
      const passwordHash = await argon2.hash(password);
      const [newUser] = await tx
        .insert(users)
        .values({
          orgId,
          name,
          email,
          passwordHash,
          emailVerified: true, // Auto-verify for access code users
        })
        .returning();

      // Assign Org Owner role if this is the first user in org
      const [ownerRole] = await tx
        .select()
        .from(roles)
        .where(and(
          eq(roles.orgId, orgId),
          eq(roles.name, 'Org Owner')
        ));

      if (ownerRole) {
        await tx
          .insert(userRoles)
          .values({
            userId: newUser.id,
            roleId: ownerRole.id,
          });
      }

      // Mark access code as used
      await tx
        .update(accessCodes)
        .set({
          status: 'used',
          consumedByUserId: newUser.id,
          consumedAt: new Date(),
        })
        .where(eq(accessCodes.id, code.id));

      return { user: newUser, orgId };
    });

    await auditLog({
      orgId: result.orgId,
      actorUserId: result.user.id,
      action: 'user_registered_with_code',
      entityType: 'user',
      entityId: result.user.id.toString(),
      meta: { accessCode },
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({
      ok: true,
      message: 'Registration successful',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        orgId: result.orgId,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      ok: false,
      error: 'registration_failed',
      message: error instanceof Error ? error.message : 'Registration failed'
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        ok: false,
        error: 'unauthorized',
        message: 'No refresh token provided'
      });
    }

    const payload = verifyToken(refreshToken, process.env.REFRESH_SECRET!);
    if (!payload) {
      return res.status(401).json({
        ok: false,
        error: 'unauthorized',
        message: 'Invalid refresh token'
      });
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id));

    if (!user) {
      return res.status(401).json({
        ok: false,
        error: 'unauthorized',
        message: 'User not found'
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: user.id,
      orgId: user.orgId,
      email: user.email,
      name: user.name,
      isSuperAdmin: user.isSuperAdmin,
      permissions: [],
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ ok: true });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({
      ok: false,
      error: 'server_error',
      message: 'Token refresh failed'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  
  res.json({ ok: true, message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  res.json({
    ok: true,
    user: req.user
  });
});

// Enroll 2FA
router.post('/enroll-2fa', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const secret = generateTOTPSecret();
    const encryptedSecret = encrypt(secret);

    const totp = new OTPAuth.TOTP({
      issuer: process.env.TOTP_ISSUER || 'VictorySync',
      label: req.user!.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    });

    const qrCode = totp.toString();

    // Store encrypted secret (not enabled yet)
    await db
      .update(users)
      .set({ twoFactorSecret: encryptedSecret })
      .where(eq(users.id, req.user!.id));

    res.json({
      ok: true,
      qrCode,
      secret, // For manual entry
    });
  } catch (error) {
    console.error('2FA enroll error:', error);
    res.status(500).json({
      ok: false,
      error: 'server_error',
      message: '2FA enrollment failed'
    });
  }
});

// Enable 2FA (verify code first)
router.post('/enable-2fa', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { code } = z.object({ code: z.string().length(6) }).parse(req.body);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user!.id));

    if (!user?.twoFactorSecret) {
      return res.status(400).json({
        ok: false,
        error: 'no_secret',
        message: 'No 2FA secret found. Enroll first.'
      });
    }

    const secret = decrypt(user.twoFactorSecret);
    const totp = new OTPAuth.TOTP({
      issuer: process.env.TOTP_ISSUER || 'VictorySync',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    });

    const isValid = totp.validate({
      token: code,
      window: 1,
    });

    if (isValid === null) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_code',
        message: 'Invalid 2FA code'
      });
    }

    // Enable 2FA
    await db
      .update(users)
      .set({ twoFactorEnabled: true })
      .where(eq(users.id, req.user!.id));

    await auditLog({
      orgId: req.user!.orgId,
      actorUserId: req.user!.id,
      action: '2fa_enabled',
      entityType: 'user',
      entityId: req.user!.id.toString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({ ok: true, message: '2FA enabled successfully' });
  } catch (error) {
    console.error('2FA enable error:', error);
    res.status(500).json({
      ok: false,
      error: 'server_error',
      message: '2FA enable failed'
    });
  }
});

// Disable 2FA
router.post('/disable-2fa', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await db
      .update(users)
      .set({ 
        twoFactorEnabled: false,
        twoFactorSecret: null 
      })
      .where(eq(users.id, req.user!.id));

    await auditLog({
      orgId: req.user!.orgId,
      actorUserId: req.user!.id,
      action: '2fa_disabled',
      entityType: 'user',
      entityId: req.user!.id.toString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({ ok: true, message: '2FA disabled successfully' });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({
      ok: false,
      error: 'server_error',
      message: '2FA disable failed'
    });
  }
});

export { router };
