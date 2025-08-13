
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export interface AuthUser {
  id: number;
  orgId?: number;
  isSuperAdmin: boolean;
  permissions: string[];
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthenticated' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    // @ts-ignore augment request
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthenticated' });
  }
}
