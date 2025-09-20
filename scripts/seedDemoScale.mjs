import { neon } from '@neondatabase/serverless';
import WebSocket from "ws";
import bcrypt from 'bcryptjs';

neonConfig.webSocketConstructor = WebSocket;
const sql = neon(process.env.DATABASE_URL);

const Plans = {
  scale: {
    features: [
      'team_24_7_blended',
      'ai_automation_suite',
      'success_manager',
      'custom_integrations',
      'priority_support',
      'analytics_realtime'
    ]
  }
};

async function ensureEntitlementsValueColumn() {
  await sql/* sql */`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='entitlements' AND column_name='value'
      ) THEN
        ALTER TABLE entitlements ADD COLUMN value TEXT;
      END IF;
    END $$;
  `;
}

async function run() {
  const orgId = 'demo-scale';
  const email = 'demo@victorysync.com';
  const password = 'VictoryScale123!';

  await ensureEntitlementsValueColumn();

  // Upsert organization
  await sql/* sql */`
    INSERT INTO organizations (id, name, plan_id, timezone)
    VALUES (${orgId}, 'VictorySync Demo (Scale)', 'scale', 'America/New_York')
    ON CONFLICT (id) DO UPDATE SET plan_id='scale'
  `;

  // Upsert user in public_users
  const hash = await bcrypt.hash(password, 10);
  await sql/* sql */`
    INSERT INTO public_users (name, email, password_hash, provider, privileges)
    VALUES ('Demo Admin', ${email}, ${hash}, 'local', json_build_object('role','super_admin','org_id',${orgId}))
    ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash, provider = 'local', privileges = EXCLUDED.privileges
  `;

  // Apply entitlements for scale
  await sql/* sql */`DELETE FROM entitlements WHERE org_id = ${orgId}::text`;
  for (const f of Plans.scale.features) {
    await sql/* sql */`
      INSERT INTO entitlements (org_id, feature_id, enabled, value)
      VALUES (${orgId}::text, ${f}, true, 'enabled')
      ON CONFLICT (org_id, feature_id) DO UPDATE
        SET enabled = EXCLUDED.enabled, value = EXCLUDED.value
    `;
  }

  console.log('Seeded demo org + user.');
  console.log('Login:', email, '/', password);
}

run().catch(e => {
  console.error('Seeder failed:', e);
  process.exit(1);
});