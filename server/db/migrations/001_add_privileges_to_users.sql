
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "privileges" jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE "users" SET "privileges" = '[]'::jsonb WHERE "privileges" IS NULL;

CREATE INDEX IF NOT EXISTS users_privileges_gin ON "users" USING GIN ("privileges");
