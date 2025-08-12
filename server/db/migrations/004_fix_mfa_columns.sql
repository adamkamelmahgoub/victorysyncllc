
-- Add missing columns for MFA and other features
ALTER TABLE "public_users" 
ADD COLUMN IF NOT EXISTS "mfa_secret" text,
ADD COLUMN IF NOT EXISTS "mfa_backup_codes" jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS "require_mfa" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "force_password_reset" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "status_reason" text,
ADD COLUMN IF NOT EXISTS "login_attempts" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "locked_until" timestamp;

-- Update existing records to have proper defaults
UPDATE "public_users" SET "mfa_enabled" = false WHERE "mfa_enabled" IS NULL;
UPDATE "public_users" SET "account_locked" = false WHERE "account_locked" IS NULL;
UPDATE "public_users" SET "require_mfa" = false WHERE "require_mfa" IS NULL;
UPDATE "public_users" SET "force_password_reset" = false WHERE "force_password_reset" IS NULL;
UPDATE "public_users" SET "login_attempts" = 0 WHERE "login_attempts" IS NULL;

-- Drop access_codes table if it exists to recreate it properly
DROP TABLE IF EXISTS "access_codes";

-- Create access codes table with all columns
CREATE TABLE "access_codes" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" text UNIQUE NOT NULL,
  "org_id" text,
  "used" boolean DEFAULT false,
  "used_by" text,
  "used_at" timestamp,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "created_by" integer REFERENCES "public_users"("id")
);

-- Create indexes for performance (after table is fully created)
CREATE INDEX IF NOT EXISTS "idx_public_users_mfa_enabled" ON "public_users"("mfa_enabled");
CREATE INDEX IF NOT EXISTS "idx_public_users_locked_until" ON "public_users"("locked_until");
CREATE INDEX IF NOT EXISTS "idx_access_codes_code" ON "access_codes"("code");
CREATE INDEX IF NOT EXISTS "idx_access_codes_used" ON "access_codes"("used");
CREATE INDEX IF NOT EXISTS "idx_access_codes_expires_at" ON "access_codes"("expires_at");
