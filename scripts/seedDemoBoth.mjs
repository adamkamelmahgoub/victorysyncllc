
// scripts/seedDemoBoth.mjs
// Upserts demo org (numeric id), inserts demo user into public_users (and users if it exists),
// and ensures ALL features are enabled (covers Scale).

import { neon, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = WebSocket;

const sql = neon(process.env.DATABASE_URL);

const EMAIL = "demo@victorysync.com";
const PASSWORD = "VictoryScale123!";
const DEMO_NAME = "Demo Admin";

const ORG_NAME = "VictorySync Demo (Scale)";
const ORG_TZ = "America/New_York";

async function getNumericOrgId() {
  // CTE: get existing org.id by name, else insert and return new id (no string ids)
  const rows = await sql/*sql*/`
    WITH upsert_org AS (
      SELECT id FROM organizations WHERE name = ${ORG_NAME}
      UNION ALL
      SELECT id FROM (
        INSERT INTO organizations (name, timezone)
        VALUES (${ORG_NAME}, ${ORG_TZ})
        RETURNING id
      ) ins
      LIMIT 1
    )
    SELECT id FROM upsert_org;
  `;
  return rows[0].id;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set in Replit Secrets"); process.exit(1);
  }

  const orgId = await getNumericOrgId();
  const hash = await bcrypt.hash(PASSWORD, 10);

  // Unique indexes so upserts are safe
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS public_users_email_idx ON public_users (email)`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users (email)`; // if table exists

  // ---- public_users (your admin auth appears to use this table) ----
  await sql/*sql*/`
    INSERT INTO public_users (name, email, password_hash, provider, provider_id, social_accounts, privileges)
    VALUES (${DEMO_NAME}, lower(${EMAIL}), ${hash}, 'local', NULL, '[]'::jsonb, '{"role":"super_admin"}'::jsonb)
    ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name,
          password_hash = EXCLUDED.password_hash,
          provider = 'local',
          provider_id = NULL,
          social_accounts = '[]'::jsonb,
          privileges = '{"role":"super_admin"}'::jsonb,
          email = lower(${EMAIL})
  `;

  // ---- users (org-scoped auth; ignore if table isn't present) ----
  try {
    await sql/*sql*/`
      INSERT INTO users (org_id, name, email, password_hash, two_factor_enabled, is_super_admin, is_active)
      VALUES (${orgId}, ${DEMO_NAME}, lower(${EMAIL}), ${hash}, false, true, true)
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
    if (!String(e?.message || e).includes('relation "users" does not exist')) throw e;
  }

  // ---- Enable ALL features for this org (idempotent) ----
  await sql/*sql*/`
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${orgId}, f.id, TRUE, NULL::text
    FROM features f
    WHERE NOT EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.org_id = ${orgId} AND e.feature_id = f.id
    )
  `;

  console.log("✅ Demo seeded:");
  console.log("   orgId:", orgId);
  console.log("   email:", EMAIL);
  console.log("   pass :", PASSWORD);
}

main().catch((e) => { console.error("❌ seedDemoBoth failed:", e?.message || e); process.exit(1); });
