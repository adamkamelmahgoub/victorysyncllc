
// scripts/seedDemoScale.mjs
import { neon, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import bcrypt from "bcryptjs";
neonConfig.webSocketConstructor = WebSocket;
const sql = neon(process.env.DATABASE_URL);

const EMAIL="demo@victorysync.com", PASSWORD="VictoryScale123!", NAME="Demo Admin";
const ORG_NAME="VictorySync Demo (Scale) — numeric", ORG_TZ="America/New_York", PLAN_ID="scale";

const intLike = v => /^[0-9]+$/.test(String(v ?? ""));

async function getOrgId() {
  const r0 = await sql`SELECT id::text id FROM organizations WHERE name=${ORG_NAME} LIMIT 1`;
  if (r0.length && intLike(r0[0].id)) return Number(r0[0].id);

  const r1 = await sql`
    SELECT COALESCE(MAX(CASE WHEN id::text ~ '^[0-9]+$' THEN (id::text)::int END),0)+1 AS next_id
    FROM organizations`;
  const nextId = Number(r1[0].next_id);

  await sql`
    INSERT INTO organizations (id,name,timezone,plan_id)
    VALUES (${nextId},${ORG_NAME},${ORG_TZ},${PLAN_ID})
    ON CONFLICT (name) DO UPDATE SET plan_id=EXCLUDED.plan_id, timezone=EXCLUDED.timezone`;
  return nextId;
}

async function main(){
  if(!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  if(!process.env.JWT_SECRET)   throw new Error("JWT_SECRET not set");

  const orgId = await getOrgId();
  const hash = await bcrypt.hash(PASSWORD,10);

  await sql`
    INSERT INTO public_users (name,email,password_hash,provider,provider_id,social_accounts,privileges)
    VALUES (${NAME},lower(${EMAIL}),${hash},'local',NULL,'[]'::jsonb,'{"role":"super_admin"}'::jsonb)
    ON CONFLICT (email) DO UPDATE
      SET name=EXCLUDED.name, password_hash=EXCLUDED.password_hash,
          provider='local', provider_id=NULL, social_accounts='[]'::jsonb,
          privileges='{"role":"super_admin"}'::jsonb, email=lower(${EMAIL})
  `;

  try{
    await sql`
      INSERT INTO users (org_id,name,email,password_hash,two_factor_enabled,is_super_admin,is_active)
      VALUES (${orgId},${NAME},lower(${EMAIL}),${hash},false,true,true)
      ON CONFLICT (email) DO UPDATE
        SET org_id=${orgId}, name=EXCLUDED.name, password_hash=EXCLUDED.password_hash,
            two_factor_enabled=false, is_super_admin=true, is_active=true, email=lower(${EMAIL})
    `;
  } catch(e){
    if(!String(e?.message||e).includes('relation "users" does not exist')) throw e;
  }

  await sql`
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${orgId}, f.id, TRUE, NULL::text
    FROM features f
    WHERE NOT EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.org_id=${orgId} AND e.feature_id=f.id
    )
  `;

  console.log("✅ Demo seeded. Login:", EMAIL, PASSWORD, "Org ID:", orgId);
}
main().catch(e=>{ console.error("❌ seedDemoScale failed:",e?.message||e); process.exit(1); });
