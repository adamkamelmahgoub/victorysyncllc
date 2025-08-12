
import { Router } from 'express';
import sql from '../db';

const router = Router();

// Users list
router.get('/users', async (_req, res) => {
  const rows = await sql`
    SELECT id, email, role, is_active, org_id,
           privileges, allowed_payment_methods, created_at
    FROM users ORDER BY created_at DESC`;
  res.json(rows);
});

// Set role/privileges/payment methods
router.post('/users/:id/access', async (req, res) => {
  const { role, privileges, allowedPaymentMethods, isActive } = req.body;
  await sql`
    UPDATE users
    SET role = COALESCE(${role}, role),
        privileges = COALESCE(${JSON.stringify(privileges ?? null)}::jsonb, privileges),
        allowed_payment_methods = COALESCE(${JSON.stringify(allowedPaymentMethods ?? null)}::jsonb, allowed_payment_methods),
        is_active = COALESCE(${isActive}, is_active)
    WHERE id=${req.params.id}`;
  res.json({ ok: true });
});

// Toggle integration for user
router.post('/users/:id/integrations/:key/toggle', async (req, res) => {
  const { id, key } = req.params;
  const [intg] = await sql`SELECT id FROM integrations WHERE key=${key}`;
  if (!intg) return res.status(404).json({message:'integration not found'});
  await sql`
    INSERT INTO user_integrations (user_id, integration_id, is_enabled)
    VALUES (${id}, ${intg.id}, true)
    ON CONFLICT (user_id, integration_id)
    DO UPDATE SET is_enabled = NOT user_integrations.is_enabled
  `;
  res.json({ ok: true });
});

// Discount codes
router.post('/discounts/issue', async (req, res) => {
  const { code, percentOff, maxRedemptions, validFrom, validTo } = req.body;
  await sql`
    INSERT INTO discount_codes (code, percent_off, max_redemptions, valid_from, valid_to)
    VALUES (${code}, ${percentOff}, ${maxRedemptions}, ${validFrom}, ${validTo})
    ON CONFLICT (code) DO UPDATE
    SET percent_off=${percentOff}, max_redemptions=${maxRedemptions}, valid_from=${validFrom}, valid_to=${validTo}`;
  res.json({ ok: true });
});

// Analytics (example KPIs)
router.get('/analytics', async (_req, res) => {
  const [[{ users }]] = await sql`SELECT COUNT(*)::int AS users FROM users`;
  const [[{ orders }]] = await sql`SELECT COUNT(*)::int AS orders FROM orders`;
  const [[{ minutes }]] = await sql`SELECT COALESCE(SUM(duration_seconds),0)::int AS minutes FROM calls`;
  res.json({ users, orders, minutes });
});

export default router;
