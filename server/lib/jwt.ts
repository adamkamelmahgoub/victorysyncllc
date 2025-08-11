
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import type { User } from '../../shared/schema';

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


