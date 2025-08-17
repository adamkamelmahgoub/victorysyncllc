
-- System timestamps for core tables (ADD ONLY, idempotent)
-- 1) helper trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- ======================
-- public_users
-- ======================
ALTER TABLE public.public_users
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- backfill any NULLs, then set defaults
UPDATE public.public_users SET updated_at = COALESCE(updated_at, created_at, now());

ALTER TABLE public.public_users
  ALTER COLUMN updated_at SET DEFAULT now();

-- try to enforce not null only after backfill
DO $$
BEGIN
  BEGIN
    ALTER TABLE public.public_users ALTER COLUMN updated_at SET NOT NULL;
  EXCEPTION WHEN others THEN
    NULL;
  END;
END$$;

-- updated_at trigger (create if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_public_users_updated_at'
  ) THEN
    CREATE TRIGGER set_public_users_updated_at
    BEFORE UPDATE ON public.public_users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  END IF;
END$$;

-- ======================
-- users (legacy table)
-- ======================
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS created_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- backfill any NULLs, then set defaults and not-null
UPDATE public.users SET created_at = COALESCE(created_at, now());
UPDATE public.users SET updated_at = COALESCE(updated_at, now());

ALTER TABLE public.users
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

-- try to enforce not null only after backfill
DO $$
BEGIN
  BEGIN
    ALTER TABLE public.users ALTER COLUMN created_at SET NOT NULL;
  EXCEPTION WHEN others THEN
    NULL;
  END;
  BEGIN
    ALTER TABLE public.users ALTER COLUMN updated_at SET NOT NULL;
  EXCEPTION WHEN others THEN
    NULL;
  END;
END$$;

-- updated_at trigger (create if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_users_updated_at'
  ) THEN
    CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  END IF;
END$$;
