
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import crypto from 'crypto';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import type { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users, sessions, auditLogs } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import type { User } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev-refresh-secret';
const TOTP_ISSUER = process.env.TOTP_ISSUER || 'VictorySync';

export interface JWTPayload {
  userId: number;
  orgId: number | null;
  email: string;
  isSuperAdmin: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  token?: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }

  static generateAccessToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      orgId: user.orgId,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  }

  static generateRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static async createSession(userId: number, refreshToken: string): Promise<void> {
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.insert(sessions).values({
      userId,
      refreshTokenHash,
      expiresAt,
    });
  }

  static async validateRefreshToken(refreshToken: string): Promise<User | null> {
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.refreshTokenHash, refreshTokenHash),
        // Check if not expired
      ),
      with: {
        user: true,
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session.user;
  }

  static async revokeSession(refreshToken: string): Promise<void> {
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await db.delete(sessions).where(eq(sessions.refreshTokenHash, refreshTokenHash));
  }

  static async generate2FASecret(userId: number): Promise<{ secret: string; qrCodeUrl: string }> {
    const secret = authenticator.generateSecret();
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new Error('User not found');
    }

    const service = TOTP_ISSUER;
    const account = user.email;
    const keyUri = authenticator.keyuri(account, service, secret);
    const qrCodeUrl = await qrcode.toDataURL(keyUri);

    return { secret, qrCodeUrl };
  }

  static verify2FAToken(token: string, secret: string): boolean {
    return authenticator.check(token, secret);
  }

  static async enable2FA(userId: number, secret: string, token: string): Promise<boolean> {
    if (!this.verify2FAToken(token, secret)) {
      return false;
    }

    // Encrypt the secret before storing
    const encryptedSecret = this.encrypt(secret);
    
    await db.update(users)
      .set({
        twoFactorEnabled: true,
        twoFactorSecret: encryptedSecret,
      })
      .where(eq(users.id, userId));

    return true;
  }

  static async disable2FA(userId: number): Promise<void> {
    await db.update(users)
      .set({
        twoFactorEnabled: false,
        twoFactorSecret: null,
      })
      .where(eq(users.id, userId));
  }

  static encrypt(text: string): string {
    const key = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  static decrypt(encryptedText: string): string {
    const key = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  static async logAudit(
    action: string,
    entityType: string,
    entityId?: string,
    meta?: any,
    actorUserId?: number,
    orgId?: number,
    req?: Request
  ): Promise<void> {
    await db.insert(auditLogs).values({
      orgId,
      actorUserId,
      action,
      entityType,
      entityId,
      meta,
      ip: req?.ip,
      userAgent: req?.get('User-Agent'),
    });
  }
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    const payload = decoded as JWTPayload;
    
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.userId),
        with: {
          organization: true,
        },
      });

      if (!user || !user.isActive) {
        return res.status(403).json({ error: 'User not found or inactive' });
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  });
}

export function requirePermissions(...permissionKeys: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Super admin bypasses all permission checks
    if (req.user.isSuperAdmin) {
      return next();
    }

    try {
      // Get user's permissions through roles
      const userPermissions = await db.query.userRoles.findMany({
        where: eq(userRoles.userId, req.user.id),
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
      });

      const permissions = userPermissions.flatMap(ur => 
        ur.role.rolePermissions.map(rp => rp.permission.key)
      );

      const hasAllPermissions = permissionKeys.every(key => permissions.includes(key));

      if (!hasAllPermissions) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: permissionKeys,
          current: permissions 
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ error: 'Permission check failed' });
    }
  };
}

export function requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user?.isSuperAdmin) {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  next();
}
