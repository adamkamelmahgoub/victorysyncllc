
// scripts/resetDemoUser.mjs
// Ensures demo org is on the SCALE plan and has all SCALE entitlements.
// Also upserts the demo user with a known password.

import { neon, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = WebSocket;
neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL);

// Credentials you will use to sign in
const EMAIL = "demo@victorysync.com";
const PASSWORD = "VictoryScale123!";
const ORG_ID = "demo-scale";

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10);

  // 1) Ensure the demo org exists and is explicitly on the SCALE plan
  await sql/*sql*/ `
    INSERT INTO organizations (id, name, timezone, plan_id)
    VALUES (${ORG_ID}, 'VictorySync Demo (Scale)', 'America/New_York', 'scale')
    ON CONFLICT (id) DO UPDATE SET plan_id='scale'
  `;

  // 2) Upsert the demo user (normalize email to lowercase)
  await sql/*sql*/ `
    INSERT INTO users (id, email, password_hash, org_id, role)
    VALUES ('user-demo-scale', lower(${EMAIL}), ${hash}, ${ORG_ID}, 'demo')
    ON CONFLICT (email) DO UPDATE
      SET email = EXCLUDED.email,
          password_hash = EXCLUDED.password_hash,
          org_id = ${ORG_ID},
          role = 'demo'
  `;

  // 3) Materialize entitlements for SCALE plan:
  //    copy every feature linked to plan_id='scale' into entitlements for this org.
  //    If your tables are named differently, adjust the names below.
  await sql/*sql*/ `
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${ORG_ID} AS org_id, pf.feature_id, TRUE AS enabled, NULL::text AS value
    FROM plan_features pf
    WHERE pf.plan_id = 'scale'
      AND NOT EXISTS (
        SELECT 1 FROM entitlements e
        WHERE e.org_id = ${ORG_ID} AND e.feature_id = pf.feature_id
      )
  `;

  // Optional: if your app expects Growth/Starter features to also be present for Scale,
  // you likely already have them in plan_features for 'scale'. If not, add second insert
  // selecting from those plan_ids as needed.

  console.log("✅ Demo user & org ready on SCALE with entitlements");
  console.log(`   email: ${EMAIL}`);
  console.log(`   pass : ${PASSWORD}`);
}
main().catch((e) => {
  console.error("❌ resetDemoUser failed:", e?.message || e);
  process.exit(1);
});
