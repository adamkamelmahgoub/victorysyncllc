
import { verify } from '../lib/jwt.js';
import type { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = (req as any).cookies?.vs_token;
  if (!token) return res.status(401).json({message:'Unauthenticated'});
  try { (req as any).user = verify(token); next(); } catch { return res.status(401).json({message:'Invalid session'}); }
}
export function requireRole(...roles: string[]) {
  return (req:any,res:any,next:any)=> roles.includes(req.user?.role) ? next() : res.status(403).json({message:'Forbidden'});
}
