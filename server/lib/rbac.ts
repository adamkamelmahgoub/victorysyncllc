
import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users, userRoles, rolePermissions, permissions } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { verifyAccessToken } from './jwt';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    orgId?: number;
    isSuperAdmin: boolean;
    permissions: string[];
  };
}

export async function authenticateJWT(
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : 
                  req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ ok: false, error: 'NO_TOKEN', message: 'Access token required' });
    }

    const decoded = verifyAccessToken(token);
    
    // Get user with permissions
    const userPermissions = await getUserPermissions(decoded.userId, decoded.orgId);
    
    req.user = {
      id: decoded.userId,
      orgId: decoded.orgId,
      isSuperAdmin: decoded.isSuperAdmin,
      permissions: userPermissions
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ ok: false, error: 'TOKEN_EXPIRED', message: 'Token expired' });
    }
    
    return res.status(401).json({ ok: false, error: 'INVALID_TOKEN', message: 'Invalid token' });
  }
}

export function requirePermissions(...requiredPermissions: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: 'UNAUTHORIZED', message: 'Authentication required' });
    }

    // Super admins bypass all permission checks
    if (req.user.isSuperAdmin) {
      return next();
    }

    const hasAllPermissions = requiredPermissions.every(permission => 
      req.user!.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({ 
        ok: false, 
        error: 'INSUFFICIENT_PERMISSIONS', 
        message: `Missing required permissions: ${requiredPermissions.join(', ')}`,
        required: requiredPermissions,
        actual: req.user.permissions
      });
    }

    next();
  };
}

export function requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user?.isSuperAdmin) {
    return res.status(403).json({ 
      ok: false, 
      error: 'SUPER_ADMIN_REQUIRED', 
      message: 'Super admin access required' 
    });
  }
  next();
}

async function getUserPermissions(userId: number, orgId?: number): Promise<string[]> {
  try {
    const userPermissionsQuery = await db
      .select({
        key: permissions.key
      })
      .from(userRoles)
      .innerJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(userRoles.userId, userId));

    return userPermissionsQuery.map(p => p.key);
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
}

export async function hasPermission(userId: number, permission: string, orgId?: number): Promise<boolean> {
  // Check if user is super admin
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user[0]?.isSuperAdmin) {
    return true;
  }

  const userPermissions = await getUserPermissions(userId, orgId);
  return userPermissions.includes(permission);
}
