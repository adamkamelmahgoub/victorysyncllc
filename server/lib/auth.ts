
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db.js';
import { users, organizations, userRoles, roles, rolePermissions, permissions } from '../db/schema.js';
import { eq, and, inArray } from 'drizzle-orm';
import { auditLog } from './audit.js';

if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
  throw new Error('JWT_SECRET and REFRESH_SECRET environment variables are required');
}

export interface AuthUser {
  id: number;
  orgId: number | null;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  permissions: string[];
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export function generateTokens(user: AuthUser) {
  const payload = {
    id: user.id,
    orgId: user.orgId,
    email: user.email,
    name: user.name,
    isSuperAdmin: user.isSuperAdmin,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET!, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

export function verifyToken(token: string, secret: string): any {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

export async function getUserPermissions(userId: number): Promise<string[]> {
  const userPermissions = await db
    .select({ key: permissions.key })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(userRoles.userId, userId));

  return userPermissions.map(p => p.key);
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;
  
  if (!token) {
    return res.status(401).json({ ok: false, error: 'unauthorized', message: 'No access token provided' });
  }

  const payload = verifyToken(token, process.env.JWT_SECRET!);
  if (!payload) {
    return res.status(401).json({ ok: false, error: 'unauthorized', message: 'Invalid or expired token' });
  }

  // Get fresh user data with permissions
  const [user] = await db
    .select({
      id: users.id,
      orgId: users.orgId,
      email: users.email,
      name: users.name,
      isSuperAdmin: users.isSuperAdmin,
    })
    .from(users)
    .where(eq(users.id, payload.id));

  if (!user) {
    return res.status(401).json({ ok: false, error: 'unauthorized', message: 'User not found' });
  }

  const permissions = await getUserPermissions(user.id);

  req.user = {
    ...user,
    permissions,
  };

  next();
}

export function requirePermissions(...requiredPermissions: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: 'unauthorized', message: 'Authentication required' });
    }

    // Super admin bypasses all permission checks
    if (req.user.isSuperAdmin) {
      return next();
    }

    const hasPermissions = requiredPermissions.every(perm => 
      req.user!.permissions.includes(perm)
    );

    if (!hasPermissions) {
      auditLog({
        orgId: req.user.orgId,
        actorUserId: req.user.id,
        action: 'permission_denied',
        entityType: 'endpoint',
        entityId: req.path,
        meta: { requiredPermissions, userPermissions: req.user.permissions },
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });

      return res.status(403).json({ 
        ok: false, 
        error: 'forbidden', 
        message: 'Insufficient permissions',
        required: requiredPermissions 
      });
    }

    next();
  };
}

export function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.isSuperAdmin) {
    return res.status(403).json({ 
      ok: false, 
      error: 'forbidden', 
      message: 'Super admin access required' 
    });
  }
  next();
}

export const AuthService = {
  async logAudit(
    action: string,
    entityType: string,
    entityId: string,
    meta: any,
    userId: number,
    orgId: number | null,
    req: Request
  ) {
    // Import auditLog here to avoid circular dependencies
    const { auditLog } = await import('./audit.js');
    
    return auditLog({
      orgId,
      actorUserId: userId,
      action,
      entityType,
      entityId,
      meta,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
  }
};
