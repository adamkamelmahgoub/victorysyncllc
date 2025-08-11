
import jwt from 'jsonwebtoken';
import { generateSecureToken } from './crypto';

interface TokenPayload {
  userId: number;
  orgId?: number;
  isSuperAdmin: boolean;
}

interface RefreshTokenPayload {
  userId: number;
  tokenId: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m',
    issuer: 'victorysync',
    audience: 'victorysync-users'
  });
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  if (!process.env.REFRESH_SECRET) {
    throw new Error('REFRESH_SECRET is required');
  }
  
  return jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: '30d',
    issuer: 'victorysync',
    audience: 'victorysync-users'
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }
  
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'victorysync',
    audience: 'victorysync-users'
  }) as TokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  if (!process.env.REFRESH_SECRET) {
    throw new Error('REFRESH_SECRET is required');
  }
  
  return jwt.verify(token, process.env.REFRESH_SECRET, {
    issuer: 'victorysync',
    audience: 'victorysync-users'
  }) as RefreshTokenPayload;
}

export function generateTokenPair(payload: TokenPayload) {
  const tokenId = generateSecureToken();
  
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken({ userId: payload.userId, tokenId }),
    tokenId
  };
}
