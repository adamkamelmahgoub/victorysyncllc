import { Router } from "express";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  // 1) Look up user and verify password (replace with your real code)
  // const user = await sql`select * from public_users where email=${email}`;
  // const ok = await bcrypt.compare(password, user.password_hash)
  const isDemo =
    email && password &&
    ((email === 'demo@victorysync.com' && password === 'VictoryScale123!') ||
     (email === 'admin@victorysync.com' && password === 'VictoryScale123!'));

  if (!isDemo) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 2) Build token payload (replace ids/role with real data)
  const payload = {
    sub: 4,            // user id
    orgId: 'demo-scale',
    role: 'super_admin'
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });

  // 3) Set secure httpOnly cookie
  res.cookie('vs_session', token, {
    httpOnly: true,
    sameSite: 'none' as const,
    secure: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  // 4) Also return JSON so client can react
  return res.json({ ok: true });
});

authRouter.post("/logout", async (_req, res) => {
  res.clearCookie('vs_session', {
    httpOnly: true,
    sameSite: 'none' as const,
    secure: true,
    path: '/',
  });
  res.json({ ok: true });
});

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