
// scripts/patchSchema.mjs
import { neon, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
neonConfig.webSocketConstructor = WebSocket;

const sql = neon(process.env.DATABASE_URL);

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");

  // --- features table (app expects these) ---
  await sql/*sql*/`
    CREATE TABLE IF NOT EXISTS features (
      id   SERIAL PRIMARY KEY,
      code VARCHAR(64) UNIQUE NOT NULL,
      name VARCHAR(128)        NOT NULL
    )
  `;
  await sql/*sql*/`
    INSERT INTO features (code, name) VALUES
      ('blended_team',        '24/7 Blended Team'),
      ('ai_suite',            'AI Automation Suite'),
      ('success_manager',     'Dedicated Success Manager'),
      ('custom_integrations', 'Custom Integrations'),
      ('priority_support',    'Priority Support'),
      ('realtime_analytics',  'Real-time Analytics')
    ON CONFLICT (code) DO NOTHING
  `;

  // --- organizations columns used by app ---
  await sql/*sql*/`
    ALTER TABLE organizations
      ADD COLUMN IF NOT EXISTS name       VARCHAR(255),
      ADD COLUMN IF NOT EXISTS plan_id    VARCHAR(32),
      ADD COLUMN IF NOT EXISTS timezone   VARCHAR(64) DEFAULT 'America/New_York',
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP    DEFAULT NOW()
  `;
  await sql/*sql*/`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE schemaname='public' AND indexname='organizations_name_idx'
      ) THEN
        CREATE UNIQUE INDEX organizations_name_idx ON organizations (name);
      END IF;
    END $$;
  `;

  // --- entitlements with 'value' column & uniqueness ---
  await sql/*sql*/`
    CREATE TABLE IF NOT EXISTS entitlements (
      id         SERIAL PRIMARY KEY,
      org_id     INTEGER NOT NULL,
      feature_id INTEGER NOT NULL,
      enabled    BOOLEAN NOT NULL DEFAULT TRUE
      -- 'value' will be added below if missing
    )
  `;
  await sql/*sql*/`ALTER TABLE entitlements ADD COLUMN IF NOT EXISTS value TEXT`;
  await sql/*sql*/`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname='entitlements_org_feature_key'
      ) THEN
        ALTER TABLE entitlements
        ADD CONSTRAINT entitlements_org_feature_key UNIQUE (org_id, feature_id);
      END IF;
    END $$;
  `;

  console.log("✅ Schema patched: features, organizations, entitlements (with value).");
}
main().catch(e => { console.error("❌ patchSchema failed:", e?.message || e); process.exit(1); });
