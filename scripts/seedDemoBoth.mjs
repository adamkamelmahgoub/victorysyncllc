
// scripts/seedDemoBoth.mjs
// Seeds a demo org with a NUMERIC id, demo admin user, and ALL features (covers Scale).
// Handles: legacy string-id orgs, NOT NULL plan_id, int/varchar id column types.

import { neon, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = WebSocket;

const sql = neon(process.env.DATABASE_URL);

// Demo creds
const EMAIL = "demo@victorysync.com";
const PASSWORD = "VictoryScale123!";
const NAME = "Demo Admin";

// Org names
const ORG_NAME = "VictorySync Demo (Scale)";              // may exist with string id (demo-scale)
const ORG_NAME_NUM = "VictorySync Demo (Scale) — numeric"; // our numeric one
const ORG_TZ = "America/New_York";
const PLAN_ID = "scale";

function isIntLike(v) {
  const s = String(v ?? "");
  return /^[0-9]+$/.test(s);
}

async function findNumericOrgId() {
  // Prefer a numeric org for the normal name
  let r = await sql/*sql*/`SELECT id::text AS id_txt FROM organizations WHERE name = ${ORG_NAME} LIMIT 1`;
  if (r.length && isIntLike(r[0].id_txt)) return Number(r[0].id_txt);

  // Or a numeric org for the numeric name
  r = await sql/*sql*/`SELECT id::text AS id_txt FROM organizations WHERE name = ${ORG_NAME_NUM} LIMIT 1`;
  if (r.length && isIntLike(r[0].id_txt)) return Number(r[0].id_txt);

  return null;
}

async function computeNextNumericId() {
  // Works for both int and varchar id columns
  const r = await sql/*sql*/`
    SELECT COALESCE(MAX(CASE WHEN (id::text ~ '^[0-9]+$') THEN (id::text)::int END), 0) + 1 AS next_id
    FROM organizations
  `;
  return Number(r[0].next_id);
}

async function ensureNumericOrg() {
  console.log("STEP 1: locate/create NUMERIC org id…");

  // If a numeric org already exists, use it (and ensure plan_id)
  const existing = await findNumericOrgId();
  if (existing !== null) {
    console.log("  found numeric org id:", existing);
    await sql/*sql*/`UPDATE organizations SET plan_id = ${PLAN_ID} WHERE id::text = ${String(existing)}`;
    return existing;
  }

  // Otherwise, insert a new org with an explicit numeric id **and plan_id**
  const nextId = await computeNextNumericId();
  console.log("  inserting new org with id =", nextId);
  await sql/*sql*/`
    INSERT INTO organizations (id, name, timezone, plan_id)
    VALUES (${nextId}, ${ORG_NAME_NUM}, ${ORG_TZ}, ${PLAN_ID})
  `;
  return nextId;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");

  const orgId = await ensureNumericOrg();

  const hash = await bcrypt.hash(PASSWORD, 10);

  console.log("STEP 2: upsert demo admin in public_users…");
  await sql/*sql*/`
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

  console.log("STEP 3: upsert into users (if table exists) with org_id =", orgId);
  try {
    await sql/*sql*/`
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

  console.log("STEP 4: grant ALL features (covers Scale)…");
  await sql/*sql*/`
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${orgId}, f.id, TRUE, NULL::text
    FROM features f
    WHERE NOT EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.org_id = ${orgId} AND e.feature_id = f.id
    )
  `;

  console.log("✅ DONE — Demo ready");
  console.log("   orgId:", orgId);
  console.log("   email:", EMAIL);
  console.log("   pass :", PASSWORD);
}

main().catch((e) => {
  console.error("❌ seedDemoBoth failed:", e?.message || e);
  process.exit(1);
});
