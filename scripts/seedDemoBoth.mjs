
// scripts/seedDemoBoth.mjs
// Upserts a demo org (numeric id), adds a demo user to public_users (and users if present),
// and enables ALL features for that org (covers Scale).

import { neon, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = WebSocket;

const sql = neon(process.env.DATABASE_URL);

// Demo credentials
const EMAIL = "demo@victorysync.com";
const PASSWORD = "VictoryScale123!";
const DEMO_NAME = "Demo Admin";

// Org (lookup by name so we never touch integer id types)
const ORG_NAME = "VictorySync Demo (Scale)";
const ORG_TZ = "America/New_York";

async function getNumericOrgId() {
  // Try to find by name
  const found = await sql/*sql*/`
    SELECT id FROM organizations WHERE name = ${ORG_NAME} LIMIT 1
  `;
  if (found.length) return found[0].id;

  // Insert new org; let DB assign INTEGER id
  const inserted = await sql/*sql*/`
    INSERT INTO organizations (name, timezone)
    VALUES (${ORG_NAME}, ${ORG_TZ})
    RETURNING id
  `;
  return inserted[0].id;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set in Replit Secrets"); process.exit(1);
  }

  const orgId = await getNumericOrgId();
  const hash = await bcrypt.hash(PASSWORD, 10);

  // Unique index for public_users email (safe to run repeatedly)
  await sql/*sql*/`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='public_users_email_idx'
      ) THEN
        CREATE UNIQUE INDEX public_users_email_idx ON public_users (email);
      END IF;
    END $$;
  `;

  // Insert/Update public_users (your admin/auth likely reads this table)
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

  // Insert/Update users table too (if it exists), ignoring if the table is absent
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
    const msg = String(e?.message || e);
    if (!msg.includes('relation "users" does not exist')) throw e;
  }

  // Enable ALL features for the org (idempotent) — guarantees Scale UX
  await sql/*sql*/`
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${orgId}, f.id, TRUE, NULL::text
    FROM features f
    WHERE NOT EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.org_id = ${orgId} AND e.feature_id = f.id
    )
  `;

  console.log("✅ Demo seeded");
  console.log("   orgId:", orgId);
  console.log("   email:", EMAIL);
  console.log("   pass :", PASSWORD);
}

main().catch((e) => { console.error("❌ seedDemoBoth failed:", e?.message || e); process.exit(1); });
