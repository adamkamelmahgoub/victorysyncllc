
// scripts/resetDemoUser.mjs
// Create/repair a demo org on the SCALE plan and a demo user, using proper org id handling.

import { neon, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = WebSocket;

const sql = neon(process.env.DATABASE_URL);

const EMAIL = "demo@victorysync.com";
const PASSWORD = "VictoryScale123!";
const ORG_ID = "demo-scale";
const ORG_NAME = "VictorySync Demo (Scale)";
const ORG_TZ = "America/New_York";
const PLAN = "scale";

async function main() {
  // Ensure unique index so email upsert works regardless of prior data
  await sql/*sql*/`CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users (email)`;

  // 1) Ensure demo org exists with proper varchar ID
  await sql/*sql*/`
    INSERT INTO organizations (id, name, timezone, plan_id)
    VALUES (${ORG_ID}, ${ORG_NAME}, ${ORG_TZ}, ${PLAN})
    ON CONFLICT (id) DO UPDATE SET 
      plan_id = ${PLAN},
      name = ${ORG_NAME},
      timezone = ${ORG_TZ}
  `;

  // 2) Upsert demo user (normalize email, let DB assign integer ID)
  const hash = await bcrypt.hash(PASSWORD, 10);
  await sql/*sql*/`
    INSERT INTO users (email, password_hash, org_id, role)
    VALUES (lower(${EMAIL}), ${hash}, ${ORG_ID}, 'demo')
    ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          org_id = ${ORG_ID},
          role = 'demo',
          email = lower(${EMAIL})
  `;

  // 3) Ensure all SCALE entitlements exist for this org (idempotent)
  await sql/*sql*/`
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${ORG_ID} AS org_id, pf.feature_id, TRUE AS enabled, NULL::text AS value
    FROM plan_features pf
    WHERE pf.plan_id = ${PLAN}
      AND NOT EXISTS (
        SELECT 1 FROM entitlements e
        WHERE e.org_id = ${ORG_ID} AND e.feature_id = pf.feature_id
      )
    ON CONFLICT DO NOTHING
  `;

  console.log("✅ Demo org & user ready on SCALE");
  console.log("   orgId:", ORG_ID);
  console.log("   email:", EMAIL);
  console.log("   pass :", PASSWORD);
}

main().catch((e) => {
  console.error("❌ resetDemoUser failed:", e?.message || e);
  process.exit(1);
});
