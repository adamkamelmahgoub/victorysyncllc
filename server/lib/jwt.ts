
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export function sign(payload: object, exp = '7d') {
  return jwt.sign(payload, SECRET, { expiresIn: exp });
}

export function verify<T = any>(token: string) {
  return jwt.verify(token, SECRET) as T;
}
