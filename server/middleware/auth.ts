
import type { Request, Response, NextFunction } from 'express';
import { verify } from '../lib/jwt';

export function extractToken(req: Request) {
  const header = req.headers['authorization'];
  if (header && typeof header === 'string' && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  
  // Fallback to cookie
  // @ts-ignore
  const cookie = req.cookies?.vs_token;
  return cookie;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
  
  try {
    (req as any).user = verify(token);
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Invalid session' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    if (roles.includes(req.user?.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
}
