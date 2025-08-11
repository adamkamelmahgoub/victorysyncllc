
import { Router } from 'express';
import { z } from 'zod';
import argon2 from 'argon2';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { db } from '../db';
import { users, sessions, accessCodes, organizations, userRoles, roles } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { generateTokenPair, verifyRefreshToken } from '../lib/jwt';
import { authenticateJWT, AuthenticatedRequest } from '../lib/rbac';
import { createAuditLog, AUDIT_ACTIONS } from '../lib/audit';
import { generateSecureToken, generateAccessCode } from '../lib/crypto';
import { seedDefaultRoles } from '../scripts/seedSuperAdmin';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerWithCodeSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  accessCode: z.string().min(1),
});

const verify2FASchema = z.object({
  token: z.string().length(6),
});

const enroll2FASchema = z.object({
  token: z.string().length(6),
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.isActive, true)))
      .limit(1);

    if (!user[0]) {
      await createAuditLog({
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        entityType: 'user',
        meta: { email, reason: 'user_not_found' },
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      return res.status(401).json({ 
        ok: false, 
        error: 'INVALID_CREDENTIALS', 
        message: 'Invalid email or password' 
      });
    }

    const validPassword = await argon2.verify(user[0].passwordHash, password);
    if (!validPassword) {
      await createAuditLog({
        orgId: user[0].orgId || undefined,
        actorUserId: user[0].id,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        entityType: 'user',
        entityId: user[0].id.toString(),
        meta: { reason: 'invalid_password' },
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      return res.status(401).json({ 
        ok: false, 
        error: 'INVALID_CREDENTIALS', 
        message: 'Invalid email or password' 
      });
    }

    // Check if 2FA is required
    if (user[0].twoFactorEnabled) {
      // Store temporary session for 2FA verification
      const tempToken = generateSecureToken();
      
      // Store in cache or session table for 10 minutes
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await db.insert(sessions).values({
        id: tempToken,
        userId: user[0].id,
        expiresAt,
      });

      res.cookie('temp2faToken', tempToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 10 * 60 * 1000, // 10 minutes
      });

      return res.json({
        ok: true,
        requires2FA: true,
        message: 'Two-factor authentication required'
      });
    }

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user[0].id,
      orgId: user[0].orgId || undefined,
      isSuperAdmin: user[0].isSuperAdmin,
    });

    // Store refresh token session
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await db.insert(sessions).values({
      id: tokens.tokenId,
      userId: user[0].id,
      expiresAt,
    });

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user[0].id));

    // Set cookies
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    await createAuditLog({
      orgId: user[0].orgId || undefined,
      actorUserId: user[0].id,
      action: AUDIT_ACTIONS.LOGIN,
      entityType: 'user',
      entityId: user[0].id.toString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({
      ok: true,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        orgId: user[0].orgId,
        isSuperAdmin: user[0].isSuperAdmin,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'SERVER_ERROR', 
      message: 'An error occurred during login' 
    });
  }
});

// 2FA Verification
router.post('/2fa/verify', async (req, res) => {
  try {
    const { token } = verify2FASchema.parse(req.body);
    const tempToken = req.cookies?.temp2faToken;

    if (!tempToken) {
      return res.status(401).json({ 
        ok: false, 
        error: 'NO_TEMP_TOKEN', 
        message: 'No temporary token found' 
      });
    }

    // Get session
    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, tempToken))
      .limit(1);

    if (!session[0] || session[0].expiresAt < new Date()) {
      return res.status(401).json({ 
        ok: false, 
        error: 'INVALID_TEMP_TOKEN', 
        message: 'Invalid or expired temporary token' 
      });
    }

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session[0].userId))
      .limit(1);

    if (!user[0] || !user[0].twoFactorSecret) {
      return res.status(401).json({ 
        ok: false, 
        error: 'USER_NOT_FOUND', 
        message: 'User not found or 2FA not enabled' 
      });
    }

    // Verify TOTP token
    const verified = speakeasy.totp.verify({
      secret: user[0].twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({ 
        ok: false, 
        error: 'INVALID_2FA_TOKEN', 
        message: 'Invalid two-factor authentication code' 
      });
    }

    // Clean up temp session
    await db.delete(sessions).where(eq(sessions.id, tempToken));

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user[0].id,
      orgId: user[0].orgId || undefined,
      isSuperAdmin: user[0].isSuperAdmin,
    });

    // Store refresh token session
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await db.insert(sessions).values({
      id: tokens.tokenId,
      userId: user[0].id,
      expiresAt,
    });

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user[0].id));

    // Clear temp cookie and set auth cookies
    res.clearCookie('temp2faToken');

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    await createAuditLog({
      orgId: user[0].orgId || undefined,
      actorUserId: user[0].id,
      action: AUDIT_ACTIONS.LOGIN,
      entityType: 'user',
      entityId: user[0].id.toString(),
      meta: { method: '2fa' },
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({
      ok: true,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        orgId: user[0].orgId,
        isSuperAdmin: user[0].isSuperAdmin,
      }
    });

  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'SERVER_ERROR', 
      message: 'An error occurred during 2FA verification' 
    });
  }
});

// Register with access code
router.post('/register-with-code', async (req, res) => {
  try {
    const { name, email, password, accessCode } = registerWithCodeSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser[0]) {
      return res.status(400).json({ 
        ok: false, 
        error: 'EMAIL_EXISTS', 
        message: 'Email already registered' 
      });
    }

    // Validate access code
    const codeRecord = await db
      .select()
      .from(accessCodes)
      .where(and(
        eq(accessCodes.code, accessCode),
        eq(accessCodes.status, 'active')
      ))
      .limit(1);

    if (!codeRecord[0]) {
      return res.status(400).json({ 
        ok: false, 
        error: 'INVALID_ACCESS_CODE', 
        message: 'Invalid or expired access code' 
      });
    }

    if (codeRecord[0].expiresAt < new Date()) {
      await db
        .update(accessCodes)
        .set({ status: 'expired' })
        .where(eq(accessCodes.id, codeRecord[0].id));

      return res.status(400).json({ 
        ok: false, 
        error: 'ACCESS_CODE_EXPIRED', 
        message: 'Access code has expired' 
      });
    }

    // Begin transaction
    await db.transaction(async (tx) => {
      let orgId = codeRecord[0].orgId;

      // If no org assigned to code, create new org and make user the owner
      if (!orgId) {
        const orgSlug = email.split('@')[0] + '-' + Date.now();
        const [newOrg] = await tx.insert(organizations).values({
          name: `${name}'s Organization`,
          slug: orgSlug,
          status: 'active',
        }).returning();
        
        orgId = newOrg.id;

        // Create default roles for the new org
        await seedDefaultRoles(orgId);
      }

      // Hash password
      const passwordHash = await argon2.hash(password);

      // Create user
      const [user] = await tx.insert(users).values({
        orgId,
        name,
        email,
        passwordHash,
        emailVerified: false,
        emailVerificationToken: generateSecureToken(),
      }).returning();

      // Assign org owner role if they created the org
      if (!codeRecord[0].orgId) {
        const ownerRole = await tx
          .select()
          .from(roles)
          .where(and(eq(roles.orgId, orgId), eq(roles.name, 'Org Owner')))
          .limit(1);

        if (ownerRole[0]) {
          await tx.insert(userRoles).values({
            userId: user.id,
            roleId: ownerRole[0].id,
          });
        }
      }

      // Mark access code as used
      await tx
        .update(accessCodes)
        .set({
          status: 'used',
          orgId,
          consumedByUserId: user.id,
          consumedAt: new Date(),
        })
        .where(eq(accessCodes.id, codeRecord[0].id));

      await createAuditLog({
        orgId,
        actorUserId: user.id,
        action: AUDIT_ACTIONS.ACCESS_CODE_USED,
        entityType: 'access_code',
        entityId: codeRecord[0].id.toString(),
        meta: { userEmail: email, userName: name },
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
    });

    res.json({
      ok: true,
      message: 'Registration successful. Please check your email to verify your account.',
      requiresEmailVerification: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'SERVER_ERROR', 
      message: 'An error occurred during registration' 
    });
  }
});

// Enroll 2FA
router.post('/enroll-2fa', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: req.user.id.toString(),
      issuer: process.env.TOTP_ISSUER || 'VictorySync',
      length: 32,
    });

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    // Store temp secret (not activated yet)
    await db
      .update(users)
      .set({ twoFactorSecret: secret.base32 })
      .where(eq(users.id, req.user.id));

    res.json({
      ok: true,
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
    });

  } catch (error) {
    console.error('2FA enrollment error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'SERVER_ERROR', 
      message: 'Failed to enroll 2FA' 
    });
  }
});

// Verify and enable 2FA
router.post('/enable-2fa', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
    }

    const { token } = enroll2FASchema.parse(req.body);

    // Get user's temp secret
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!user[0]?.twoFactorSecret) {
      return res.status(400).json({ 
        ok: false, 
        error: 'NO_SECRET', 
        message: 'No 2FA secret found. Please enroll first.' 
      });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user[0].twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ 
        ok: false, 
        error: 'INVALID_TOKEN', 
        message: 'Invalid verification code' 
      });
    }

    // Enable 2FA
    await db
      .update(users)
      .set({ twoFactorEnabled: true })
      .where(eq(users.id, req.user.id));

    await createAuditLog({
      orgId: req.user.orgId,
      actorUserId: req.user.id,
      action: AUDIT_ACTIONS.ENABLE_2FA,
      entityType: 'user',
      entityId: req.user.id.toString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({
      ok: true,
      message: 'Two-factor authentication enabled successfully'
    });

  } catch (error) {
    console.error('2FA enable error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'SERVER_ERROR', 
      message: 'Failed to enable 2FA' 
    });
  }
});

// Disable 2FA
router.post('/disable-2fa', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
    }

    const { token, password } = req.body;

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!user[0]) {
      return res.status(404).json({ ok: false, error: 'USER_NOT_FOUND' });
    }

    // Verify password
    const validPassword = await argon2.verify(user[0].passwordHash, password);
    if (!validPassword) {
      return res.status(401).json({ 
        ok: false, 
        error: 'INVALID_PASSWORD', 
        message: 'Invalid password' 
      });
    }

    // Verify current 2FA token if enabled
    if (user[0].twoFactorEnabled && user[0].twoFactorSecret) {
      const verified = speakeasy.totp.verify({
        secret: user[0].twoFactorSecret,
        encoding: 'base32',
        token,
        window: 1,
      });

      if (!verified) {
        return res.status(400).json({ 
          ok: false, 
          error: 'INVALID_2FA_TOKEN', 
          message: 'Invalid 2FA code' 
        });
      }
    }

    // Disable 2FA
    await db
      .update(users)
      .set({ 
        twoFactorEnabled: false,
        twoFactorSecret: null,
      })
      .where(eq(users.id, req.user.id));

    await createAuditLog({
      orgId: req.user.orgId,
      actorUserId: req.user.id,
      action: AUDIT_ACTIONS.DISABLE_2FA,
      entityType: 'user',
      entityId: req.user.id.toString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({
      ok: true,
      message: 'Two-factor authentication disabled successfully'
    });

  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'SERVER_ERROR', 
      message: 'Failed to disable 2FA' 
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ ok: false, error: 'NO_REFRESH_TOKEN' });
    }

    const decoded = verifyRefreshToken(refreshToken);

    // Check if session exists and is valid
    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, decoded.tokenId))
      .limit(1);

    if (!session[0] || session[0].expiresAt < new Date()) {
      res.clearCookie('refreshToken');
      return res.status(401).json({ ok: false, error: 'INVALID_REFRESH_TOKEN' });
    }

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.id, decoded.userId), eq(users.isActive, true)))
      .limit(1);

    if (!user[0]) {
      return res.status(401).json({ ok: false, error: 'USER_NOT_FOUND' });
    }

    // Generate new tokens
    const tokens = generateTokenPair({
      userId: user[0].id,
      orgId: user[0].orgId || undefined,
      isSuperAdmin: user[0].isSuperAdmin,
    });

    // Update session
    await db
      .update(sessions)
      .set({ 
        id: tokens.tokenId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .where(eq(sessions.id, decoded.tokenId));

    // Set new cookies
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      ok: true,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        orgId: user[0].orgId,
        isSuperAdmin: user[0].isSuperAdmin,
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ ok: false, error: 'REFRESH_FAILED' });
  }
});

// Logout
router.post('/logout', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        await db.delete(sessions).where(eq(sessions.id, decoded.tokenId));
      } catch (error) {
        // Token might be invalid, but still clear cookies
      }
    }

    if (req.user) {
      await createAuditLog({
        orgId: req.user.orgId,
        actorUserId: req.user.id,
        action: AUDIT_ACTIONS.LOGOUT,
        entityType: 'user',
        entityId: req.user.id.toString(),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('temp2faToken');

    res.json({ ok: true, message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'SERVER_ERROR', 
      message: 'An error occurred during logout' 
    });
  }
});

// Get current user
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
    }

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        orgId: users.orgId,
        isSuperAdmin: users.isSuperAdmin,
        twoFactorEnabled: users.twoFactorEnabled,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!user[0]) {
      return res.status(404).json({ ok: false, error: 'USER_NOT_FOUND' });
    }

    res.json({
      ok: true,
      user: user[0]
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'SERVER_ERROR', 
      message: 'Failed to get user information' 
    });
  }
});

export default router;
