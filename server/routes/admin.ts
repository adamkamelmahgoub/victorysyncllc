
import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db';

export const admin = Router();

admin.get('/api/admin/users', async (_req, res) => {
  const users = await query<any>`
    SELECT u.id, u.email, u.phone, u.full_name, u.role, u.is_active, u.email_verified, u.phone_verified,
           up.can_use_api, up.can_manage_org, up.can_view_billing, up.integrations,
           pp.allow_card, pp.allow_paypal, pp.allow_wire, o.name AS org_name
    FROM users u
    LEFT JOIN user_permissions up ON up.user_id = u.id
    LEFT JOIN user_payment_policies pp ON pp.user_id = u.id
    LEFT JOIN organizations o ON o.id = u.org_id
    ORDER BY u.created_at DESC
  `;
  
  res.json(users);
});

admin.post('/api/admin/users/:id/policy', async (req, res) => {
  const id = req.params.id;
  const body = z.object({
    can_use_api: z.boolean(),
    can_manage_org: z.boolean(),
    can_view_billing: z.boolean(),
    integrations: z.record(z.boolean()),
    allow_card: z.boolean(),
    allow_paypal: z.boolean(),
    allow_wire: z.boolean(),
    is_active: z.boolean()
  }).parse(req.body);

  await query`UPDATE user_permissions SET can_use_api=${body.can_use_api}, can_manage_org=${body.can_manage_org}, can_view_billing=${body.can_view_billing}, integrations=${JSON.stringify(body.integrations)}, updated_at=now() WHERE user_id=${id}`;
  
  await query`UPDATE user_payment_policies SET allow_card=${body.allow_card}, allow_paypal=${body.allow_paypal}, allow_wire=${body.allow_wire}, updated_at=now() WHERE user_id=${id}`;
  
  await query`UPDATE users SET is_active=${body.is_active} WHERE id=${id}`;
  
  res.json({ ok: true });
});

admin.get('/api/admin/analytics', async (_req, res) => {
  const rows = await query<any>`
    SELECT u.id, u.full_name,
      SUM(CASE WHEN date_trunc('day', c.created_at) = date_trunc('day', now()) THEN 1 ELSE 0 END) AS calls_today,
      SUM(CASE WHEN date_trunc('month', c.created_at) = date_trunc('month', now()) THEN 1 ELSE 0 END) AS calls_month
    FROM users u LEFT JOIN call_events c ON c.user_id = u.id
    GROUP BY u.id ORDER BY calls_month DESC NULLS LAST
  `;
  
  res.json(rows);
});
