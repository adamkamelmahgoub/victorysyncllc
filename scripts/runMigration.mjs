
import { neon } from '@neondatabase/serverless';
import WebSocket from 'ws';

// Configure WebSocket for Neon
const neonConfig = { webSocketConstructor: WebSocket };
const sql = neon(process.env.DATABASE_URL, neonConfig);

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set");
  }

  console.log("🔧 Starting sequential migration...");

  try {
    // Step 1: Ensure entitlements table exists with proper structure
    console.log("Step 1: Creating entitlements table...");
    await sql`
      CREATE TABLE IF NOT EXISTS entitlements (
        id         SERIAL PRIMARY KEY,
        org_id     INTEGER NOT NULL,
        feature_id INTEGER NOT NULL,
        enabled    BOOLEAN NOT NULL DEFAULT TRUE
      )
    `;
    
    await sql`ALTER TABLE entitlements ADD COLUMN IF NOT EXISTS value TEXT`;
    
    // Step 2: Add unique constraint if missing
    console.log("Step 2: Adding unique constraint...");
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name='entitlements' AND constraint_name='entitlements_org_feature_key'
        ) THEN
          ALTER TABLE entitlements
            ADD CONSTRAINT entitlements_org_feature_key UNIQUE (org_id, feature_id);
        END IF;
      END $$
    `;

    // Step 3: Create helper sequence
    console.log("Step 3: Creating org fix sequence...");
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind='S' AND relname='org_fix_seq') THEN
          CREATE SEQUENCE org_fix_seq START WITH 1;
        END IF;
      END $$
    `;

    // Step 4: Set sequence above current max numeric-looking id
    console.log("Step 4: Setting sequence start value...");
    await sql`
      DO $$
      DECLARE max_cast bigint;
      BEGIN
        SELECT COALESCE(MAX((id::text)::bigint),0)
        INTO   max_cast
        FROM   organizations
        WHERE  id::text ~ '^[0-9]+$';
        PERFORM setval('org_fix_seq', max_cast + 1, false);
      END $$
    `;

    // Step 5: Add new integer column
    console.log("Step 5: Adding id_new column...");
    await sql`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS id_new BIGINT`;

    // Step 6: Fill id_new uniquely
    console.log("Step 6: Filling id_new with unique values...");
    await sql`
      WITH casted AS (
        SELECT
          o.ctid,
          CASE WHEN o.id::text ~ '^[0-9]+$' THEN (o.id::text)::bigint ELSE NULL END AS cast_id,
          ROW_NUMBER() OVER (
            PARTITION BY CASE WHEN o.id::text ~ '^[0-9]+$' THEN o.id::text ELSE NULL END
            ORDER BY o.ctid
          ) AS rn
        FROM organizations o
      )
      UPDATE organizations o
      SET id_new = CASE
        WHEN c.cast_id IS NULL THEN nextval('org_fix_seq')
        WHEN c.rn = 1         THEN c.cast_id
        ELSE                       nextval('org_fix_seq')
      END
      FROM casted c
      WHERE o.ctid = c.ctid
        AND o.id_new IS NULL
    `;

    // Step 7: Set id_new to NOT NULL
    console.log("Step 7: Setting id_new NOT NULL...");
    await sql`ALTER TABLE organizations ALTER COLUMN id_new SET NOT NULL`;

    // Step 8: Drop existing primary key if exists
    console.log("Step 8: Dropping old primary key...");
    await sql`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_schema='public' AND table_name='organizations' AND constraint_type='PRIMARY KEY'
        ) THEN
          ALTER TABLE organizations DROP CONSTRAINT organizations_pkey;
        END IF;
      END $$
    `;

    // Step 9: Set new primary key
    console.log("Step 9: Setting new primary key...");
    await sql`ALTER TABLE organizations ADD CONSTRAINT organizations_pkey PRIMARY KEY (id_new)`;

    // Step 10: Preserve old id as id_legacy
    console.log("Step 10: Preserving old id as id_legacy...");
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema='public' AND table_name='organizations' AND column_name='id_legacy'
        ) THEN
          ALTER TABLE organizations RENAME COLUMN id TO id_legacy;
        END IF;
      END $$
    `;

    // Step 11: Rename id_new to id
    console.log("Step 11: Renaming id_new to id...");
    await sql`ALTER TABLE organizations RENAME COLUMN id_new TO id`;

    // Step 12: Add app-friendly columns
    console.log("Step 12: Adding app columns...");
    await sql`
      ALTER TABLE organizations
        ADD COLUMN IF NOT EXISTS name       VARCHAR(255),
        ADD COLUMN IF NOT EXISTS plan_id    VARCHAR(32),
        ADD COLUMN IF NOT EXISTS timezone   VARCHAR(64) DEFAULT 'America/New_York',
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP    DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS id_text    TEXT GENERATED ALWAYS AS (id::text) STORED
    `;

    // Step 13: Create unique name index
    console.log("Step 13: Creating unique name index...");
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes
          WHERE schemaname='public' AND indexname='organizations_name_idx'
        ) THEN
          CREATE UNIQUE INDEX organizations_name_idx ON organizations (name);
        END IF;
      END $$
    `;

    // Step 14: Add foreign keys (users table)
    console.log("Step 14: Adding users foreign key...");
    await sql`
      DO $$
      BEGIN
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE table_name='users' AND constraint_name='users_org_fk'
          ) THEN
            ALTER TABLE users
            ADD CONSTRAINT users_org_fk
            FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE SET NULL;
          END IF;
        EXCEPTION WHEN undefined_table THEN
          -- users table may not exist; skip
          NULL;
        END;
      END $$
    `;

    // Step 15: Add foreign keys (entitlements table)
    console.log("Step 15: Adding entitlements foreign key...");
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name='entitlements' AND constraint_name='entitlements_org_fk'
        ) THEN
          ALTER TABLE entitlements
          ADD CONSTRAINT entitlements_org_fk
          FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;
        END IF;
      END $$
    `;

    console.log("✅ Migration completed successfully!");
    
  } catch (error) {
    console.error(`❌ Migration failed:`, error.message);
    throw error;
  }
}

runMigration().catch(e => {
  console.error("❌ runMigration failed:", e?.message || e);
  process.exit(1);
});
