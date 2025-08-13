
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'fallback-secret-not-secure';
console.log('JWT_SECRET not set, using fallback secret (not secure for production)');

export function sign(payload: object, expires = '7d') {
  return jwt.sign(payload, SECRET, { expiresIn: expires });
}

export function verify<T = any>(token: string) {
  return jwt.verify(token, SECRET) as T;
}
