
import { Router } from "express";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';
import { db } from '../db.js';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me';
const COOKIE_NAME = 'vs_token';

function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function readToken(req: any) {
  const raw = req.cookies?.[COOKIE_NAME];
  if (!raw) return null;
  try {
    return jwt.verify(raw, JWT_SECRET);
  } catch {
    return null;
  }
}

async function fakeVerifyUser(email: string, password: string) {
  // Demo login logic
  const valid =
    (email === 'demo@victorysync.com' && password === 'VictoryScale123!') ||
    (email === 'admin@victorysync.com' && password === 'VictoryScale123!');

  if (!valid) return null;

  return {
    id: 1,
    email,
    role: 'super_admin',
    orgId: 'demo-scale',
  };
}

async function fakeLoadUserWithEntitlements(userId: number) {
  return {
    id: userId,
    email: 'demo@victorysync.com',
    role: 'super_admin',
    orgId: 'demo-scale',
    org: { id: 'demo-scale', name: 'Demo Organization', plan_id: 'scale' },
    plan: 'scale',
    entitlements: [
      { feature_id: 'ai_automation', enabled: true, value: 'enabled' },
      { feature_id: 'advanced_reporting', enabled: true, value: 'enabled' },
      { feature_id: 'priority_support', enabled: true, value: 'enabled' }
    ]
  };
}

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  
  const user = await fakeVerifyUser(email, password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    orgId: user.orgId,
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  
  res.json({ ok: true });
});

// GET /api/auth/me
authRouter.get('/me', async (req, res) => {
  const claims = readToken(req);
  if (!claims) return res.status(401).json({ message: 'Unauthorized' });

  const user = await fakeLoadUserWithEntitlements(claims.sub);
  res.json({ ok: true, user, org: user.org, plan: user.plan, entitlements: user.entitlements });
});

// POST /api/auth/logout
authRouter.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

authRouter.get("/session", async (req, res) => {
  const claims = readToken(req);
  res.json({ 
    authenticated: !!claims, 
    orgId: claims?.orgId ?? null, 
    userId: claims?.sub ?? null 
  });
});
