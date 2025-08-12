
-- Fix public_users table to have consistent column naming
ALTER TABLE "public_users" 
ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS "status" varchar(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS "role" varchar(50) DEFAULT 'customer',
ADD COLUMN IF NOT EXISTS "permissions" jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS "feature_flags" jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS "org_id" varchar(255),
ADD COLUMN IF NOT EXISTS "last_login_at" timestamp,
ADD COLUMN IF NOT EXISTS "account_locked" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "lock_reason" text,
ADD COLUMN IF NOT EXISTS "mfa_enabled" boolean DEFAULT false;

-- Update existing records to have consistent data
UPDATE "public_users" SET "is_active" = true WHERE "is_active" IS NULL;
UPDATE "public_users" SET "status" = 'active' WHERE "status" IS NULL;
UPDATE "public_users" SET "role" = 'customer' WHERE "role" IS NULL;
UPDATE "public_users" SET "permissions" = '[]'::jsonb WHERE "permissions" IS NULL;
UPDATE "public_users" SET "feature_flags" = '[]'::jsonb WHERE "feature_flags" IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_public_users_status" ON "public_users"("status");
CREATE INDEX IF NOT EXISTS "idx_public_users_role" ON "public_users"("role");
CREATE INDEX IF NOT EXISTS "idx_public_users_org_id" ON "public_users"("org_id");
