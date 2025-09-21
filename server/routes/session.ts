
import { Router, type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const sessionRouter = Router();

export type JWTPayload = {
  sub: string | number;
  orgId?: string | number;
  role?: string;
  email?: string;
};

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-please-set-JWT_SECRET';

export const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'none' as const, // cross-site cookies (Replit preview)
  secure: true,              // HTTPS only; Replit preview is HTTPS
  path: '/',                 // send to all paths
  // Do NOT set "domain" in Replit previews
};

export function authRequired(req: Request, res: Response, next: NextFunction) {
  try {
    const fromCookie = req.cookies?.vs_session as string | undefined;
    const fromHeader = (req.get('authorization') || '').replace(/^Bearer\s+/i, '') || undefined;
    const token = fromCookie || fromHeader;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    (req as any).user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function meHandler(req: Request, res: Response) {
  return res.json({ user: (req as any).user ?? null });
}

// /api/session/me — canonical "who am I?" endpoint
sessionRouter.get('/me', authRequired, meHandler);

// /api/session/logout — clears cookie using the SAME options used to set it
sessionRouter.post('/logout', (req, res) => {
  res.clearCookie('vs_session', baseCookieOptions);
  return res.json({ ok: true });
});

// Dev-only helper (optional): see cookies server-side
// sessionRouter.get('/debug/cookies', (req, res) => res.json({ cookies: req.cookies, hasAuth: !!req.cookies?.vs_session }));
