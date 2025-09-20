
// scripts/seedDemoBoth.mjs
// Creates/fetches demo org by NAME (numeric id), seeds demo user into public_users
// (and users if present), and grants ALL features to that org. Idempotent.

import { neon, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = WebSocket;

const sql = neon(process.env.DATABASE_URL);

// Demo login
const EMAIL = "demo@victorysync.com";
const PASSWORD = "VictoryScale123!";
const NAME = "Demo Admin";

// Org lookup (NEVER use a string id)
const ORG_NAME = "VictorySync Demo (Scale)";
const ORG_TZ = "America/New_York";

async function getNumericOrgId() {
  console.log("STEP 1: find org id by name…");
  const found = await sql`SELECT id FROM organizations WHERE name = ${ORG_NAME} LIMIT 1`;
  if (found.length) {
    console.log("  found existing org id:", found[0].id);
    return found[0].id;
  }
  console.log("  inserting new org (DB assigns integer id) …");
  const ins = await sql`
    INSERT INTO organizations (name, timezone)
    VALUES (${ORG_NAME}, ${ORG_TZ})
    RETURNING id
  `;
  console.log("  created org id:", ins[0].id);
  return ins[0].id;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  const orgId = await getNumericOrgId();
  const hash = await bcrypt.hash(PASSWORD, 10);

  console.log("STEP 2: upsert public_users (primary auth table) …");
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

  console.log("STEP 3: upsert users (org-scoped) if the table exists …");
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
      console.log("  users table not found; skipping (ok).");
    } else {
      throw e;
    }
  }

  console.log("STEP 4: materialize ALL features as entitlements (covers Scale) …");
  await sql`
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${orgId}, f.id, TRUE, NULL::text
    FROM features f
    WHERE NOT EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.org_id = ${orgId} AND e.feature_id = f.id
    )
  `;

  console.log("✅ DONE — Demo seeded");
  console.log("   orgId:", orgId);
  console.log("   email:", EMAIL);
  console.log("   pass :", PASSWORD);
}

main().catch((e) => {
  console.error("❌ seedDemoBoth failed:", e?.message || e);
  process.exit(1);
});
