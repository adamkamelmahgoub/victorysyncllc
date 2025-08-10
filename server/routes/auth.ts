
import express from 'express';
import { z } from 'zod';
import { db } from '../db';
import { users, organizations, accessCodes, userRoles, roles } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { AuthService, authenticateToken, type AuthenticatedRequest } from '../lib/auth';
import { loginSchema, verify2faSchema, enroll2faSchema, registerWithCodeSchema } from '@shared/schema';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await db.query.users.findFirst({
      where: and(
        eq(users.email, email.toLowerCase()),
        eq(users.isActive, true)
      ),
      with: {
        organization: true,
      },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ 
        ok: false, 
        error: 'invalid_credentials', 
        message: 'Invalid email or password' 
      });
    }

    const validPassword = await AuthService.verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ 
        ok: false, 
        error: 'invalid_credentials', 
        message: 'Invalid email or password' 
      });
    }

    // Update last login
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Generate a temporary session token for 2FA verification
      const temp2faToken = crypto.randomBytes(32).toString('hex');
      
      // Store temp token in cache/redis or use short-lived JWT
      // For now, we'll use a short-lived JWT
      const tempToken = jwt.sign(
        { userId: user.id, temp2fa: true },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '5m' }
      );

      return res.json({
        ok: true,
        requires2FA: true,
        tempToken,
      });
    }

    // Generate tokens
    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken();

    // Create session
    await AuthService.createSession(user.id, refreshToken);

    // Log audit
    await AuthService.logAudit(
      'login',
      'user',
      user.id.toString(),
      { method: 'password' },
      user.id,
      user.orgId,
      req
    );

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
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        orgId: user.orgId,
        isSuperAdmin: user.isSuperAdmin,
        twoFactorEnabled: user.twoFactorEnabled,
        organization: user.organization,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        error: 'validation_error', 
        message: 'Invalid input',
        errors: error.errors 
      });
    }
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Login failed' 
    });
  }
});

// 2FA Verification
router.post('/2fa/verify', async (req, res) => {
  try {
    const { token: totpToken, tempToken } = req.body;

    if (!tempToken) {
      return res.status(400).json({ 
        ok: false, 
        error: 'temp_token_required', 
        message: 'Temporary token required' 
      });
    }

    // Verify temp token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'dev-secret') as any;
    } catch {
      return res.status(401).json({ 
        ok: false, 
        error: 'invalid_temp_token', 
        message: 'Invalid or expired temporary token' 
      });
    }

    if (!decoded.temp2fa) {
      return res.status(401).json({ 
        ok: false, 
        error: 'invalid_temp_token', 
        message: 'Invalid temporary token' 
      });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId),
      with: {
        organization: true,
      },
    });

    if (!user || !user.twoFactorSecret) {
      return res.status(401).json({ 
        ok: false, 
        error: 'user_not_found', 
        message: 'User not found or 2FA not enabled' 
      });
    }

    // Decrypt and verify TOTP
    const decryptedSecret = AuthService.decrypt(user.twoFactorSecret);
    const isValidToken = AuthService.verify2FAToken(totpToken, decryptedSecret);

    if (!isValidToken) {
      return res.status(401).json({ 
        ok: false, 
        error: 'invalid_2fa_token', 
        message: 'Invalid 2FA token' 
      });
    }

    // Generate real tokens
    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken();

    // Create session
    await AuthService.createSession(user.id, refreshToken);

    // Update last login
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Log audit
    await AuthService.logAudit(
      'login',
      'user',
      user.id.toString(),
      { method: '2fa' },
      user.id,
      user.orgId,
      req
    );

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
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        orgId: user.orgId,
        isSuperAdmin: user.isSuperAdmin,
        twoFactorEnabled: user.twoFactorEnabled,
        organization: user.organization,
      },
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: '2FA verification failed' 
    });
  }
});

// Register with Access Code
router.post('/register-with-code', async (req, res) => {
  try {
    const { name, email, password, accessCode: code } = registerWithCodeSchema.parse(req.body);

    await db.transaction(async (tx) => {
      // Find and validate access code
      const accessCode = await tx.query.accessCodes.findFirst({
        where: and(
          eq(accessCodes.code, code),
          eq(accessCodes.status, 'active')
        ),
      });

      if (!accessCode) {
        throw new Error('Invalid or expired access code');
      }

      if (accessCode.expiresAt < new Date()) {
        throw new Error('Access code has expired');
      }

      // Check if email already exists
      const existingUser = await tx.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      });

      if (existingUser) {
        throw new Error('Email already registered');
      }

      let orgId = accessCode.orgId;

      // If no org assigned to code, create one
      if (!orgId) {
        const orgSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        const [newOrg] = await tx.insert(organizations).values({
          name: `${name}'s Organization`,
          slug: orgSlug,
          status: 'active',
        }).returning();

        orgId = newOrg.id;

        // Update access code with org
        await tx.update(accessCodes)
          .set({ orgId })
          .where(eq(accessCodes.id, accessCode.id));
      }

      // Create user
      const passwordHash = await AuthService.hashPassword(password);
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');

      const [newUser] = await tx.insert(users).values({
        orgId,
        name,
        email: email.toLowerCase(),
        passwordHash,
        emailVerificationToken,
        isActive: false, // Require email verification
      }).returning();

      // Mark access code as used
      await tx.update(accessCodes)
        .set({
          status: 'used',
          consumedByUserId: newUser.id,
          consumedAt: new Date(),
        })
        .where(eq(accessCodes.id, accessCode.id));

      // Find and assign org owner role
      const orgOwnerRole = await tx.query.roles.findFirst({
        where: and(
          eq(roles.orgId, orgId),
          eq(roles.name, 'Org Owner')
        ),
      });

      if (orgOwnerRole) {
        await tx.insert(userRoles).values({
          userId: newUser.id,
          roleId: orgOwnerRole.id,
        });
      }

      // Log audit
      await AuthService.logAudit(
        'register_with_code',
        'user',
        newUser.id.toString(),
        { accessCodeId: accessCode.id },
        undefined,
        orgId,
        req
      );

      // TODO: Send email verification email
      // await sendEmailVerification(newUser.email, emailVerificationToken);

      res.json({
        ok: true,
        message: 'Registration successful. Please check your email to verify your account.',
        userId: newUser.id,
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        error: 'validation_error', 
        message: 'Invalid input',
        errors: error.errors 
      });
    }
    res.status(400).json({ 
      ok: false, 
      error: 'registration_failed', 
      message: error.message || 'Registration failed' 
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        ok: false, 
        error: 'not_authenticated', 
        message: 'Not authenticated' 
      });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, req.user.id),
      with: {
        organization: true,
        userRoles: {
          with: {
            role: {
              with: {
                rolePermissions: {
                  with: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ 
        ok: false, 
        error: 'user_not_found', 
        message: 'User not found' 
      });
    }

    const permissions = user.userRoles.flatMap(ur => 
      ur.role.rolePermissions.map(rp => rp.permission.key)
    );

    res.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        orgId: user.orgId,
        isSuperAdmin: user.isSuperAdmin,
        twoFactorEnabled: user.twoFactorEnabled,
        emailVerified: user.emailVerified,
        organization: user.organization,
        permissions,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to get user' 
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ 
        ok: false, 
        error: 'refresh_token_required', 
        message: 'Refresh token required' 
      });
    }

    const user = await AuthService.validateRefreshToken(refreshToken);
    if (!user) {
      return res.status(401).json({ 
        ok: false, 
        error: 'invalid_refresh_token', 
        message: 'Invalid refresh token' 
      });
    }

    // Generate new tokens
    const newAccessToken = AuthService.generateAccessToken(user);
    const newRefreshToken = AuthService.generateRefreshToken();

    // Remove old session and create new one
    await AuthService.revokeSession(refreshToken);
    await AuthService.createSession(user.id, newRefreshToken);

    // Set new cookies
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ ok: true });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Token refresh failed' 
    });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await AuthService.revokeSession(refreshToken);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({ ok: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Logout failed' 
    });
  }
});

// Enroll 2FA
router.post('/2fa/enroll', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        ok: false, 
        error: 'not_authenticated', 
        message: 'Not authenticated' 
      });
    }

    const { secret, qrCodeUrl } = await AuthService.generate2FASecret(req.user.id);

    res.json({
      ok: true,
      secret,
      qrCodeUrl,
    });
  } catch (error) {
    console.error('2FA enrollment error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: '2FA enrollment failed' 
    });
  }
});

// Confirm 2FA enrollment
router.post('/2fa/confirm', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        ok: false, 
        error: 'not_authenticated', 
        message: 'Not authenticated' 
      });
    }

    const { token, secret } = enroll2faSchema.parse(req.body);

    const success = await AuthService.enable2FA(req.user.id, secret, token);

    if (!success) {
      return res.status(400).json({ 
        ok: false, 
        error: 'invalid_token', 
        message: 'Invalid 2FA token' 
      });
    }

    // Log audit
    await AuthService.logAudit(
      'enable_2fa',
      'user',
      req.user.id.toString(),
      {},
      req.user.id,
      req.user.orgId,
      req
    );

    res.json({ ok: true, message: '2FA enabled successfully' });
  } catch (error) {
    console.error('2FA confirmation error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        error: 'validation_error', 
        message: 'Invalid input',
        errors: error.errors 
      });
    }
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: '2FA confirmation failed' 
    });
  }
});

// Disable 2FA
router.post('/2fa/disable', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        ok: false, 
        error: 'not_authenticated', 
        message: 'Not authenticated' 
      });
    }

    await AuthService.disable2FA(req.user.id);

    // Log audit
    await AuthService.logAudit(
      'disable_2fa',
      'user',
      req.user.id.toString(),
      {},
      req.user.id,
      req.user.orgId,
      req
    );

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

export default router;
import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ message: 'Auth routes coming soon' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Auth routes coming soon' });
});

export default router;
