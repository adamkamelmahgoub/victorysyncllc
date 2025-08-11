
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import type { User } from '../../shared/schema';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface TokenPayload {
  userId: number;
  orgId?: number;
  isSuperAdmin: boolean;
  tokenId: string;
  iat: number;
  exp: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenId: string;
}

export function generateTokenPair(payload: {
  userId: number;
  orgId?: number;
  isSuperAdmin: boolean;
}): TokenPair {
  const tokenId = Math.random().toString(36).substring(2);
  
  const commonPayload = {
    ...payload,
    tokenId
  };

  const accessToken = jwt.sign(commonPayload, process.env.JWT_SECRET!, {
    expiresIn: '15m'
  });

  const refreshToken = jwt.sign(commonPayload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '30d'
  });

  return { accessToken, refreshToken, tokenId };
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
}

export function authenticateJWT(req: AuthenticatedRequest, res: any, next: any) {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      id: decoded.userId,
      orgId: decoded.orgId || null,
      isSuperAdmin: decoded.isSuperAdmin
    } as User;
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, error: 'INVALID_TOKEN' });
  }
}
