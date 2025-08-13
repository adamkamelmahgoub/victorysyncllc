
import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { query } from '../db/index.js';

export const admin = Router();

// Create access code
admin.post('/admin/access-codes', async (req, res) => {
  try {
    const { email, phone, name, organization, expiresIn } = z.object({
      email: z.string().email(),
      phone: z.string().optional(),
      name: z.string(),
      organization: z.string(),
      expiresIn: z.number().optional(), // days
    }).parse(req.body);

    const code = crypto.randomBytes(16).toString('hex');
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000) : null;

    await query`
      INSERT INTO access_codes (code, email, phone, full_name, organization, expires_at)
      VALUES (${code}, ${email}, ${phone || null}, ${name}, ${organization}, ${expiresAt})
    `;

    res.status(201).json({ code, expiresAt });
  } catch (error) {
    console.error('Create access code error:', error);
    res.status(400).json({ message: 'Invalid request' });
  }
});

// Get all users
admin.get('/admin/users', async (_req, res) => {
  try {
    const users = await query`
      SELECT u.id, u.email, u.phone, u.full_name, u.role, u.is_active, 
             u.email_verified, u.phone_verified, u.two_factor_enabled,
             up.can_use_api, up.can_manage_org, up.can_view_billing, up.integrations,
             pp.allow_card, pp.allow_paypal, pp.allow_wire, 
             o.name AS org_name
      FROM users u
      LEFT JOIN user_permissions up ON up.user_id = u.id
      LEFT JOIN user_payment_policies pp ON pp.user_id = u.id
      LEFT JOIN organizations o ON o.id = u.org_id
      ORDER BY u.created_at DESC
    `;
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user permissions
admin.patch('/admin/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = z.object({
      is_active: z.boolean().optional(),
      can_use_api: z.boolean().optional(),
      can_manage_org: z.boolean().optional(),
      can_view_billing: z.boolean().optional(),
      integrations: z.record(z.boolean()).optional(),
      allow_card: z.boolean().optional(),
      allow_paypal: z.boolean().optional(),
      allow_wire: z.boolean().optional(),
    }).parse(req.body);

    if (updates.is_active !== undefined) {
      await query`
        UPDATE users SET is_active = ${updates.is_active} WHERE id = ${id}
      `;
    }

    if (updates.can_use_api !== undefined || updates.can_manage_org !== undefined || 
        updates.can_view_billing !== undefined || updates.integrations !== undefined) {
      await query`
        UPDATE user_permissions SET 
          can_use_api = COALESCE(${updates.can_use_api}, can_use_api),
          can_manage_org = COALESCE(${updates.can_manage_org}, can_manage_org),
          can_view_billing = COALESCE(${updates.can_view_billing}, can_view_billing),
          integrations = COALESCE(${JSON.stringify(updates.integrations || {})}, integrations),
          updated_at = now()
        WHERE user_id = ${id}
      `;
    }

    if (updates.allow_card !== undefined || updates.allow_paypal !== undefined || 
        updates.allow_wire !== undefined) {
      await query`
        UPDATE user_payment_policies SET 
          allow_card = COALESCE(${updates.allow_card}, allow_card),
          allow_paypal = COALESCE(${updates.allow_paypal}, allow_paypal),
          allow_wire = COALESCE(${updates.allow_wire}, allow_wire),
          updated_at = now()
        WHERE user_id = ${id}
      `;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({ message: 'Invalid request' });
  }
});

// Get analytics
admin.get('/admin/analytics', async (_req, res) => {
  try {
    const analytics = await query`
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT CASE WHEN u.is_active THEN u.id END) as active_users,
        COUNT(DISTINCT o.id) as total_orgs,
        COUNT(DISTINCT ce.id) as total_calls,
        COUNT(DISTINCT CASE WHEN DATE(ce.created_at) = CURRENT_DATE THEN ce.id END) as calls_today
      FROM users u
      LEFT JOIN organizations o ON o.id = u.org_id
      LEFT JOIN call_events ce ON ce.user_id = u.id
    `;

    const userGrowth = await query`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    res.json({
      summary: analytics[0] || {
        total_users: 0,
        active_users: 0,
        total_orgs: 0,
        total_calls: 0,
        calls_today: 0,
      },
      userGrowth,
      source: analytics.length > 0 ? 'database' : 'empty',
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get access codes
admin.get('/admin/access-codes', async (_req, res) => {
  try {
    const codes = await query`
      SELECT id, code, email, phone, full_name, organization, used, expires_at, created_at
      FROM access_codes
      ORDER BY created_at DESC
    `;
    
    res.json(codes);
  } catch (error) {
    console.error('Get access codes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
