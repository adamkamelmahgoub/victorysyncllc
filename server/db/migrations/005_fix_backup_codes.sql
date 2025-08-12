
-- Fix missing backup_codes column and other columns referenced in storage.ts
ALTER TABLE "public_users" 
ADD COLUMN IF NOT EXISTS "backup_codes" jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS "email_verified" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "phone_verified" boolean DEFAULT false;

-- Update existing records to have proper defaults
UPDATE "public_users" SET "backup_codes" = '[]'::jsonb WHERE "backup_codes" IS NULL;
UPDATE "public_users" SET "email_verified" = false WHERE "email_verified" IS NULL;
UPDATE "public_users" SET "phone_verified" = false WHERE "phone_verified" IS NULL;
