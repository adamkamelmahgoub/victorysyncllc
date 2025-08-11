
import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users, userRoles, roles, rolePermissions, permissions } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { verifyAccessToken } from './jwt';
import type { User } from '../../shared/schema';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export async function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    
    // Get full user details from database
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.id, decoded.userId), eq(users.isActive, true)))
      .limit(1);

    if (!user[0]) {
      res.status(401).json({ ok: false, error: 'USER_NOT_FOUND' });
      return;
    }

    req.user = user[0];
    next();
  } catch (error) {
    res.status(401).json({ ok: false, error: 'INVALID_TOKEN' });
  }
}

export function requirePermission(permission: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
    }

    if (req.user.isSuperAdmin) {
      return next();
    }

    try {
      const userPermissions = await db
        .select()
        .from(permissions)
        .innerJoin(rolePermissions, eq(permissions.id, rolePermissions.permissionId))
        .innerJoin(roles, eq(rolePermissions.roleId, roles.id))
        .innerJoin(userRoles, eq(roles.id, userRoles.roleId))
        .where(eq(userRoles.userId, req.user.id));

      const hasPermission = userPermissions.some(p => p.permissions.key === permission);

      if (!hasPermission) {
        return res.status(403).json({ ok: false, error: 'FORBIDDEN' });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ ok: false, error: 'SERVER_ERROR' });
    }
  };
}
