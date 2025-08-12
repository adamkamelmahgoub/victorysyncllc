import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET!;
export function sign(payload: object, expires='7d') {
  return jwt.sign(payload, SECRET, { expiresIn: expires });
}
export function verify<T=any>(token: string) {
  return jwt.verify(token, SECRET) as T;
}
export function generateJWT(payload: any, expires = '30d'): string {
  return jwt.sign(payload, SECRET, { expiresIn: expires } as jwt.SignOptions);
}