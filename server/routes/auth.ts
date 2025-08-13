
import { Router } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db, sql } from '../db/index.js';
import { authenticateJWT } from '../lib/authenticate.js';

export const router = Router();

/** Admin issues an access code tied to an email/phone/org */
router.post('/admin/access-codes', authenticateJWT, async (req, res) => {
  // @ts-ignore
  if (!req.user?.permissions?.includes('manage_access_codes')) return res.status(403).json({ message: 'Forbidden' });
  const { email, phone, orgName, expiresAt } = req.body;
  if (!email || !orgName) return res.status(400).json({ message: 'Missing fields' });
  const code = crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  const q = await db.execute(sql`
    INSERT INTO access_codes (code, email, phone, org_name, created_by, expires_at)
    VALUES (${code}, ${email}, ${phone || null}, ${orgName}, ${req.user.id}, ${expiresAt ? new Date(expiresAt) : sql`NOW() + interval '7 days'`})
    RETURNING code
  `);
  // @ts-ignore
  const result = Array.isArray(q) ? q[0] : q.rows[0];
  res.json({ code: result.code });
});

/** Customer registers using access code; verifies email/phone/orgName match */
router.post('/register-with-code', async (req, res) => {
  const { name, email, phone, orgName, password, accessCode } = req.body;
  if (!name || !email || !orgName || !password || !accessCode) return res.status(400).json({ message: 'Missing fields' });

  const { rows } = await db.execute(sql`
    SELECT * FROM access_codes
    WHERE code = ${accessCode}
      AND consumed_at IS NULL
      AND expires_at > NOW()
    LIMIT 1
  `);
  const ac = rows?.[0];
  if (!ac) return res.status(400).json({ message: 'Invalid or expired access code' });
  if (ac.email !== email || (ac.phone && phone && ac.phone !== phone) || ac.org_name !== orgName) {
    return res.status(400).json({ message: 'Details do not match access code' });
  }

  // Ensure org exists or create
  const orgRes = await db.execute(sql`
    INSERT INTO organizations (name)
    VALUES (${orgName})
    ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name
    RETURNING id
  `);
  const orgId = (orgRes.rows?.[0]?.id) ?? orgRes[0]?.id;

  const passwordHash = await argon2.hash(password);
  const userRes = await db.execute(sql`
    INSERT INTO users (org_id, name, email, phone, password_hash)
    VALUES (${orgId}, ${name}, ${email}, ${phone || null}, ${passwordHash})
    RETURNING id
  `);
  const userId = (userRes.rows?.[0]?.id) ?? userRes[0]?.id;

  // Default org_admin role for first user in org
  const r = await db.execute(sql`SELECT id FROM roles WHERE key='org_admin' LIMIT 1`);
  const roleId = (r.rows?.[0]?.id) ?? r[0]?.id;
  await db.execute(sql`INSERT INTO user_roles (user_id, role_id) VALUES (${userId}, ${roleId}) ON CONFLICT DO NOTHING`);

  await db.execute(sql`UPDATE access_codes SET consumed_at = NOW() WHERE id = ${ac.id}`);

  const token = jwt.sign(
    { id: userId, orgId, isSuperAdmin: false, permissions: ['manage_orgs','manage_integrations','manage_billing','view_kpis','manage_access_codes'] },
    process.env.JWT_SECRET!, { expiresIn: '12h' }
  );
  res.json({ token });
});

/** Login + /me remain; ensure /me returns permissions derived from roles */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await db.execute(sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`);
  const u = rows?.[0];
  if (!u || !(await argon2.verify(u.password_hash, password))) return res.status(401).json({ message: 'Invalid credentials' });

  const permsQ = await db.execute(sql`
    SELECT DISTINCT p.key FROM user_roles ur
      JOIN role_permissions rp ON rp.role_id = ur.role_id
      JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = ${u.id}
  `);
  const permissions = (permsQ.rows ?? permsQ).map((r:any)=>r.key);
  const isSuperAdmin = permissions.length > 0 && permissions.every(Boolean) && permissions.includes('manage_admins');

  const token = jwt.sign({ id: u.id, orgId: u.org_id, isSuperAdmin, permissions }, process.env.JWT_SECRET!, { expiresIn: '12h' });
  res.json({ token });
});

router.get('/me', authenticateJWT, async (req, res) => {
  // @ts-ignore
  const user = req.user;
  res.json(user);
});

export { router as auth };
