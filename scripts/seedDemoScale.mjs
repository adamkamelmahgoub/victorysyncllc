// scripts/seedDemoScale.mjs
import { neon as createNeon, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = WebSocket;
const sql = createNeon(process.env.DATABASE_URL);

const EMAIL="demo@victorysync.com", PASS="VictoryScale123!", NAME="Demo Admin";
const ORG="VictorySync Demo (Scale)", ORG_TZ="America/New_York", PLAN="scale";

async function upsertOrgId() {
  const r = await sql/*sql*/`
    INSERT INTO organizations (name, timezone, plan_id)
    VALUES (${ORG}, ${ORG_TZ}, ${PLAN})
    ON CONFLICT (name) DO UPDATE
      SET plan_id=EXCLUDED.plan_id, timezone=EXCLUDED.timezone
    RETURNING id`;
  return Number(r[0].id); // guaranteed integer
}

async function main(){
  if(!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  if(!process.env.JWT_SECRET)   throw new Error("JWT_SECRET not set");

  console.log("STEP 1: ensure Scale org (integer id) …");
  const orgId = await upsertOrgId();
  console.log("  orgId:", orgId);

  console.log("STEP 2: upsert demo admin in public_users …");
  const hash = await bcrypt.hash(PASS, 10);
  await sql/*sql*/`
    INSERT INTO public_users (name,email,password_hash,provider,provider_id,social_accounts,privileges)
    VALUES (${NAME}, lower(${EMAIL}), ${hash}, 'local', NULL, '[]'::jsonb, '{"role":"super_admin"}'::jsonb)
    ON CONFLICT (email) DO UPDATE
      SET name=EXCLUDED.name, password_hash=EXCLUDED.password_hash,
          provider='local', provider_id=NULL, social_accounts='[]'::jsonb,
          privileges='{"role":"super_admin"}'::jsonb, email=lower(${EMAIL})
  `;

  console.log("STEP 3: upsert into users (if table exists) …");
  try{
    await sql/*sql*/`
      INSERT INTO users (org_id,name,email,password_hash,two_factor_enabled,is_super_admin,is_active)
      VALUES (${orgId}, ${NAME}, lower(${EMAIL}), ${hash}, false, true, true)
      ON CONFLICT (email) DO UPDATE
        SET org_id=${orgId}, name=EXCLUDED.name, password_hash=EXCLUDED.password_hash,
            two_factor_enabled=false, is_super_admin=true, is_active=true, email=lower(${EMAIL})
    `;
  }catch(e){
    if(!String(e?.message||e).includes('relation "users" does not exist')) throw e;
    console.log("  users table not found; skipping.");
  }

  console.log("STEP 4: grant ALL features to org (covers Scale) …");
  await sql/*sql*/`
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${orgId}, f.id, TRUE, NULL::text
    FROM features f
    WHERE NOT EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.org_id=${orgId} AND e.feature_id=f.id
    )
  `;

  console.log("✅ Demo ready. Login:", EMAIL, PASS, "Org:", ORG, "OrgId:", orgId);
}

main().catch(e => { console.error("❌ seedDemoScale failed:", e?.message || e); process.exit(1); });

const EMAIL = "demo@victorysync.com";
const PASSWORD = "VictoryScale123!";
const NAME = "Demo Admin";
const ORG_NAME = "VictorySync Demo (Scale)";
const ORG_TZ = "America/New_York";
const PLAN_ID = "scale";

async function upsertOrgId() {
  const result = await sql`
    INSERT INTO organizations (name, timezone, plan_id)
    VALUES (${ORG_NAME}, ${ORG_TZ}, ${PLAN_ID})
    ON CONFLICT (name) DO UPDATE
      SET plan_id=EXCLUDED.plan_id, timezone=EXCLUDED.timezone
    RETURNING id
  `;
  return Number(result[0].id); // guaranteed integer
}

async function ensureFeatures() {
  await sql`
    CREATE TABLE IF NOT EXISTS features (
      id   SERIAL PRIMARY KEY,
      code VARCHAR(64) UNIQUE NOT NULL,
      name VARCHAR(128)        NOT NULL
    )
  `;
  
  await sql`
    INSERT INTO features (code, name) VALUES
      ('blended_team',        '24/7 Blended Team'),
      ('ai_suite',            'AI Automation Suite'),
      ('success_manager',     'Dedicated Success Manager'),
      ('custom_integrations', 'Custom Integrations'),
      ('priority_support',    'Priority Support'),
      ('realtime_analytics',  'Real-time Analytics')
    ON CONFLICT (code) DO NOTHING
  `;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");

  console.log("STEP 1: ensure Scale org (integer id) …");
  const orgId = await upsertOrgId();
  console.log("  orgId:", orgId);

  console.log("STEP 2: upsert demo admin in public_users …");
  const hash = await bcrypt.hash(PASSWORD, 10);
  await sql`
    INSERT INTO public_users (name,email,password_hash,provider,provider_id,social_accounts,privileges)
    VALUES (${NAME}, lower(${EMAIL}), ${hash}, 'local', NULL, '[]'::jsonb, '{"role":"super_admin"}'::jsonb)
    ON CONFLICT (email) DO UPDATE
      SET name=EXCLUDED.name, password_hash=EXCLUDED.password_hash,
          provider='local', provider_id=NULL, social_accounts='[]'::jsonb,
          privileges='{"role":"super_admin"}'::jsonb, email=lower(${EMAIL})
  `;

  console.log("STEP 3: upsert into users (if table exists) …");
  try {
    await sql`
      INSERT INTO users (org_id,name,email,password_hash,two_factor_enabled,is_super_admin,is_active)
      VALUES (${orgId}, ${NAME}, lower(${EMAIL}), ${hash}, false, true, true)
      ON CONFLICT (email) DO UPDATE
        SET org_id=${orgId}, name=EXCLUDED.name, password_hash=EXCLUDED.password_hash,
            two_factor_enabled=false, is_super_admin=true, is_active=true, email=lower(${EMAIL})
    `;
  } catch (e) {
    if (!String(e?.message || e).includes('relation "users" does not exist')) throw e;
    console.log("  users table not found; skipping.");
  }

  console.log("STEP 4: ensure features table and grant ALL features to org …");
  await ensureFeatures();
  
  await sql`
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${orgId}, f.id, TRUE, NULL::text
    FROM features f
    WHERE NOT EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.org_id=${orgId} AND e.feature_id=f.id
    )
  `;

  console.log("✅ Demo ready. Login:", EMAIL, PASSWORD, "Org:", ORG_NAME, "OrgId:", orgId);
}

main().catch(e => { 
  console.error("❌ seedDemoScale failed:", e?.message || e); 
  process.exit(1); 
});
