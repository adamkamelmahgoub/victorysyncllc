
// scripts/seedDemoScale.mjs
import { neon, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = WebSocket;
const sql = neon(process.env.DATABASE_URL);

// Demo creds
const EMAIL = "demo@victorysync.com";
const PASSWORD = "VictoryScale123!";
const NAME = "Demo Admin";

// Org
const ORG_NAME   = "VictorySync Demo (Scale) — numeric";
const ORG_TZ     = "America/New_York";
const PLAN_ID    = "scale";

const intLike = (v) => /^[0-9]+$/.test(String(v ?? ""));

async function getOrCreateNumericOrgId() {
  // Prefer an existing numeric org by our deterministic name
  const r0 = await sql`SELECT id::text AS id_txt FROM organizations WHERE name = ${ORG_NAME} LIMIT 1`;
  if (r0.length && intLike(r0[0].id_txt)) return Number(r0[0].id_txt);

  // Compute a safe next numeric id, even if organizations.id is VARCHAR
  const r1 = await sql`
    SELECT COALESCE(MAX(CASE WHEN id::text ~ '^[0-9]+$' THEN (id::text)::int END), 0) + 1 AS next_id
    FROM organizations`;
  const nextId = Number(r1[0].next_id);

  await sql`
    INSERT INTO organizations (id, name, timezone, plan_id)
    VALUES (${nextId}, ${ORG_NAME}, ${ORG_TZ}, ${PLAN_ID})
    ON CONFLICT (name) DO UPDATE SET plan_id = EXCLUDED.plan_id, timezone = EXCLUDED.timezone`;

  return nextId;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  if (!process.env.JWT_SECRET)   throw new Error("JWT_SECRET not set");

  console.log("STEP 1: ensure numeric org on Scale…");
  const orgId = await getOrCreateNumericOrgId();

  console.log("STEP 2: upsert demo admin in public_users…");
  const hash = await bcrypt.hash(PASSWORD, 10);
  await sql`
    INSERT INTO public_users (name, email, password_hash, provider, provider_id, social_accounts, privileges)
    VALUES (${NAME}, lower(${EMAIL}), ${hash}, 'local', NULL, '[]'::jsonb, '{"role":"super_admin"}'::jsonb)
    ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name,
          password_hash = EXCLUDED.password_hash,
          provider = 'local',
          provider_id = NULL,
          social_accounts = '[]'::jsonb,
          privileges = '{"role":"super_admin"}'::jsonb,
          email = lower(${EMAIL})
  `;

  console.log("STEP 3: upsert into users (if present)…");
  try {
    await sql`
      INSERT INTO users (org_id, name, email, password_hash, two_factor_enabled, is_super_admin, is_active)
      VALUES (${orgId}, ${NAME}, lower(${EMAIL}), ${hash}, false, true, true)
      ON CONFLICT (email) DO UPDATE
        SET org_id = ${orgId},
            name = EXCLUDED.name,
            password_hash = EXCLUDED.password_hash,
            two_factor_enabled = false,
            is_super_admin = true,
            is_active = true,
            email = lower(${EMAIL})
    `;
  } catch (e) {
    const msg = String(e?.message || e);
    if (msg.includes('relation "users" does not exist')) {
      console.log("  users table missing; skipping (ok).");
    } else throw e;
  }

  console.log("STEP 4: grant ALL features (covers Scale)…");
  await sql`
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${orgId}, f.id, TRUE, NULL::text
    FROM features f
    WHERE NOT EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.org_id = ${orgId} AND e.feature_id = f.id
    )`;

  console.log("✅ DONE — Demo ready");
  console.log("   orgId:", orgId);
  console.log("   email:", EMAIL);
  console.log("   pass :", PASSWORD);
}

main().catch((e) => { console.error("❌ seedDemoScale failed:", e?.message || e); process.exit(1); });
