
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-key-change-in-production';

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET not set, using fallback secret (not secure for production)');
}

export function sign(payload: object, exp = '7d') {
  return jwt.sign(payload, SECRET, { expiresIn: exp });
}

export function verify<T = any>(token: string) {
  try {
    return jwt.verify(token, SECRET) as T;
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw error;
  }
}
