
// scripts/resetDemoUser.mjs
// Upserts a demo Scale org + user and ensures all Scale entitlements exist.

import { neon, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = WebSocket;

const sql = neon(process.env.DATABASE_URL);

const EMAIL = "demo@victorysync.com";
const PASSWORD = "VictoryScale123!";
const ORG_ID = "demo-scale";

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10);

  // 0) Safety: unique index on users.email so ON CONFLICT works
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users (email)`;

  // 1) Ensure demo org exists and is on SCALE
  await sql/*sql*/`
    INSERT INTO organizations (id, name, timezone, plan_id)
    VALUES (${ORG_ID}, 'VictorySync Demo (Scale)', 'America/New_York', 'scale')
    ON CONFLICT (id) DO UPDATE SET plan_id = 'scale'
  `;

  // 2) Upsert demo user (LET THE DB ASSIGN id — do NOT insert "id")
  await sql/*sql*/`
    INSERT INTO users (email, password_hash, org_id, role)
    VALUES (lower(${EMAIL}), ${hash}, ${ORG_ID}, 'demo')
    ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          org_id = ${ORG_ID},
          role = 'demo',
          email = lower(${EMAIL})
  `;

  // 3) Ensure Scale entitlements exist for this org (idempotent)
  await sql/*sql*/`
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${ORG_ID} AS org_id, pf.feature_id, TRUE AS enabled, NULL::text AS value
    FROM plan_features pf
    WHERE pf.plan_id = 'scale'
      AND NOT EXISTS (
        SELECT 1 FROM entitlements e
        WHERE e.org_id = ${ORG_ID} AND e.feature_id = pf.feature_id
      )
  `;

  console.log("✅ Demo user/org ready on SCALE:");
  console.log("   email:", EMAIL);
  console.log("   pass :", PASSWORD);
}

main().catch((e) => {
  console.error("❌ resetDemoUser failed:", e?.message || e);
  process.exit(1);
});
