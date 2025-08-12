
import { Router } from 'express';
import { sql } from '../db';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/me', async (req, res) => {
  const uid = (req as any).user?.sub;
  if (!uid) return res.status(401).end();
  const [u] = await sql`
    SELECT id, email, role, privileges, allowed_payment_methods, twofa_enabled
    FROM users WHERE id=${uid}`;
  res.json(u);
});

router.get('/usage', async (req, res) => {
  const uid = (req as any).user?.sub;
  if (!uid) return res.status(401).end();
  const [[{ calls }]] = await sql`SELECT COUNT(*)::int AS calls FROM calls WHERE user_id=${uid}`;
  const [[{ seconds }]] = await sql`SELECT COALESCE(SUM(duration_seconds),0)::int AS seconds FROM calls WHERE user_id=${uid}`;
  res.json({ calls, minutes: Math.round(seconds/60) });
});

router.post('/apikey/rotate', async (req, res) => {
  const uid = (req as any).user?.sub;
  if (!uid) return res.status(401).end();
  const token = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(token, 10);
  const [org] = await sql`SELECT org_id FROM users WHERE id=${uid}`;
  await sql`
    INSERT INTO api_keys (user_id, org_id, name, token_hash, is_active, scopes)
    VALUES (${uid}, ${org?.org_id ?? null}, 'Primary', ${hash}, true, ARRAY['read','write'])
    ON CONFLICT DO NOTHING
  `;
  res.json({ token });
});

router.post('/payments/allow', async (req, res) => {
  const uid = (req as any).user?.sub;
  if (!uid) return res.status(401).end();
  const { methods } = req.body; // array of strings
  await sql`
    UPDATE users SET allowed_payment_methods=${JSON.stringify(methods)}::jsonb
    WHERE id=${uid}`;
  res.json({ ok: true });
});

export default router;
