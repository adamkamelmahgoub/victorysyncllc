
import { verify } from '../lib/jwt';
import type { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.vs_token;
  if (!token) return res.status(401).json({message:'Unauthenticated'});
  try { 
    (req as any).user = verify(token); 
    next(); 
  } catch { 
    return res.status(401).json({message:'Invalid session'}); 
  }
}

export function requireRole(...roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user?.role)) return res.status(403).json({message:'Forbidden'});
    next();
  };
}
