
import 'dotenv/config';
import { db, sql } from '../db/index.js';
import argon2 from 'argon2';

(async () => {
  const email = process.env.SUPERADMIN_EMAIL!;
  const pass = process.env.SUPERADMIN_PASSWORD!;
  if (!email || !pass) throw new Error('Set SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD');

  const orgRes = await db.execute(sql`INSERT INTO organizations (name) VALUES ('VictorySync') ON CONFLICT (name) DO NOTHING RETURNING id`);
  const orgId = orgRes.rows?.[0]?.id ?? (await db.execute(sql`SELECT id FROM organizations WHERE name='VictorySync' LIMIT 1`)).rows[0].id;

  const { rows } = await db.execute(sql`SELECT id FROM users WHERE email=${email} LIMIT 1`);
  if (rows?.[0]) {
    console.log('Super admin already exists'); process.exit(0);
  }

  const hash = await argon2.hash(pass);
  const uRes = await db.execute(sql`
    INSERT INTO users (org_id, name, email, password_hash, is_active)
    VALUES (${orgId}, 'Super Admin', ${email}, ${hash}, TRUE)
    RETURNING id
  `);
  const userId = uRes.rows?.[0]?.id;

  const role = await db.execute(sql`SELECT id FROM roles WHERE key='super_admin' LIMIT 1`);
  const roleId = role.rows?.[0]?.id;
  await db.execute(sql`INSERT INTO user_roles (user_id, role_id) VALUES (${userId}, ${roleId}) ON CONFLICT DO NOTHING`);

  console.log('✅ Super admin seeded');
  process.exit(0);
})();
