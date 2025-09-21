import { Router } from "express";
import jwt from "jsonwebtoken";
import { authRequired, baseCookieOptions, JWT_SECRET, meHandler } from './session';

export const authRouter = Router();

// POST /api/auth/login — demo login; swap for real DB lookup later
authRouter.post('/login', async (req, res) => {
  const { email, password } = (req.body || {}) as { email?: string; password?: string };

  const valid =
    (email === 'demo@victorysync.com' && password === 'VictoryScale123!') ||
    (email === 'admin@victorysync.com' && password === 'VictoryScale123!');

  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const payload = {
    sub: 1,
    email,
    orgId: 'demo-scale',
    role: 'super_admin',
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  res.cookie('vs_session', token, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.json({ ok: true });
});

// GET /api/auth/me — alias to /api/session/me so either path works
authRouter.get("/me", async (req, res) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.vs_session;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      return res.status(401).json({ ok: false, user: null });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const orgId = String(decoded.orgId);

    // Get org and entitlements
    const [org] = await sql`
      SELECT id::text AS id, name, plan_id FROM organizations WHERE id = ${orgId}::text
    `;
    const ent = await sql`
      SELECT feature_id, enabled, COALESCE(value, 'enabled') AS value
      FROM entitlements
      WHERE org_id = ${orgId}::text
      ORDER BY feature_id
    `;
    
    res.status(200).json({ 
      ok: true, 
      user: {
        id: decoded.sub,
        orgId: decoded.orgId, 
        role: decoded.role || 'admin'
      },
      org,
      plan: org?.plan_id ?? null,
      entitlements: ent
    });
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ ok: false, user: null });
  }
});

authRouter.get("/session", async (req, res) => {
  const a = (req as any).auth;
  res.json({ authenticated: !!a, orgId: a?.orgId ?? null, userId: a?.userId ?? null });
});