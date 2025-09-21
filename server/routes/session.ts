
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const sessionRouter = Router();

type JWTPayload = { sub: number | string; orgId?: number | string; role?: string; };

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Shared cookie options
const baseCookieOptions = {
  httpOnly: true,
  // Replit preview is cross-site → SameSite=None + Secure=true required
  sameSite: 'none' as const,
  secure: true,
  path: '/',          // send to all paths
  // domain: undefined // usually omit on Replit so the browser accepts it
};

export function authRequired(req: Request, res: Response, next: NextFunction) {
  try {
    // Read from cookie first
    const token = req.cookies?.vs_session
      // or Authorization: Bearer <token>
      ?? (req.get('authorization')?.split(' ')[1] ?? '');

    if (!token) return res.status(401).json({ error: 'Missing token' });

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    // attach to req for downstream handlers
    (req as any).user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

sessionRouter.get('/me', authRequired, async (req, res) => {
  // You can hydrate from DB here if you want; keeping it simple:
  return res.json({ user: (req as any).user });
});

sessionRouter.post('/logout', (req, res) => {
  res.clearCookie('vs_session', baseCookieOptions);
  return res.json({ ok: true });
});

export { baseCookieOptions, JWT_SECRET };
