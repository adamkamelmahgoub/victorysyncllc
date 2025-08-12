
import { sql } from './index';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

async function main() {
  // packages
  await sql`INSERT INTO packages (name, price, minutes_included)
            VALUES ('Starter', 1200, 2000),
                   ('Growth', 2500, 5000),
                   ('Scale', 4500, 12000)
            ON CONFLICT DO NOTHING`;

  // org
  const [org] = await sql`INSERT INTO organizations (name)
                          VALUES ('VictorySync LLC')
                          ON CONFLICT DO NOTHING
                          RETURNING *`;

  // admin user
  const email = 'admin@victorysync.com';
  const pass = await bcrypt.hash('ChangeMeNow!42', 10);
  await sql`
    INSERT INTO users (email, password_hash, role, org_id, privileges, allowed_payment_methods, twofa_enabled)
    VALUES (${email}, ${pass}, 'admin', ${org?.id ?? null}, ${JSON.stringify([
      'users:read','users:write','billing:read','billing:write',
      'integrations:write','discounts:write','analytics:read'
    ])}::jsonb, '["card","wire","paypal"]'::jsonb, false)
    ON CONFLICT (email) DO NOTHING
  `;

  // access code
  await sql`INSERT INTO access_codes (code, description, max_uses)
            VALUES ('TEAM-ACCESS', 'Internal access', 100)
            ON CONFLICT DO NOTHING`;

  // base integrations
  await sql`INSERT INTO integrations (key,name)
            VALUES ('hubspot','HubSpot'),('zoho','Zoho CRM'),
                   ('aircall','Aircall'),('twilio','Twilio')
            ON CONFLICT DO NOTHING`;

  console.log('✅ Seed complete');
}
main();
