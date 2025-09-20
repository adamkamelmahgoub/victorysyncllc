
import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

// Ensure entitlements has a `value` column (idempotent)
export async function ensureEntitlementsValueColumn() {
  await sql/* sql */`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='entitlements' AND column_name='value'
      ) THEN
        ALTER TABLE entitlements ADD COLUMN value TEXT;
      END IF;
    END $$;
  `;
}

// Always compare params to organizations.id as TEXT
export const asOrgText = (orgId: string | number) => String(orgId);

// Convenience getters
export async function getOrgById(orgId: string) {
  const rows = await sql/* sql */`
    SELECT id::text AS id, name, plan_id, timezone
    FROM organizations
    WHERE id = ${orgId}::text
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function setOrgPlan(orgId: string, planId: string) {
  await sql/* sql */`
    UPDATE organizations SET plan_id = ${planId}
    WHERE id = ${orgId}::text
  `;
}
