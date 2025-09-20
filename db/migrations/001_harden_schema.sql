
-- === FEATURES ===============================================================
CREATE TABLE IF NOT EXISTS features (
  id            SERIAL PRIMARY KEY,
  code          VARCHAR(64) UNIQUE NOT NULL,
  name          VARCHAR(128)        NOT NULL
);

-- Seed core Scale features if they don't exist (idempotent)
INSERT INTO features (code, name) VALUES
  ('blended_team',        '24/7 Blended Team'),
  ('ai_suite',            'AI Automation Suite'),
  ('success_manager',     'Dedicated Success Manager'),
  ('custom_integrations', 'Custom Integrations'),
  ('priority_support',    'Priority Support'),
  ('realtime_analytics',  'Real-time Analytics')
ON CONFLICT (code) DO NOTHING;

-- === ORGANIZATIONS ==========================================================
-- Your table exists, but we ensure the columns/indexes needed by the app.
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS name      VARCHAR(255),
  ADD COLUMN IF NOT EXISTS plan_id   VARCHAR(32),
  ADD COLUMN IF NOT EXISTS timezone  VARCHAR(64) DEFAULT 'America/New_York',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Prefer unique org names to make upserts deterministic.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'organizations_name_idx'
  ) THEN
    CREATE UNIQUE INDEX organizations_name_idx ON organizations (name);
  END IF;
END $$;

-- If plan_id is NULL anywhere, set a sensible default
UPDATE organizations SET plan_id = 'scale' WHERE plan_id IS NULL;

-- === PUBLIC USERS ===========================================================
CREATE TABLE IF NOT EXISTS public_users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  email          VARCHAR(255) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  provider       VARCHAR(32)  NOT NULL DEFAULT 'local',
  provider_id    VARCHAR(128),
  social_accounts JSONB       NOT NULL DEFAULT '[]'::jsonb,
  privileges     JSONB        NOT NULL DEFAULT '{}'::jsonb,
  created_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Ensure unique email index (in case older schema missed it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname='public' AND indexname='public_users_email_idx'
  ) THEN
    CREATE UNIQUE INDEX public_users_email_idx ON public_users (email);
  END IF;
END $$;

-- === APP USERS (optional table some routes may use) =========================
CREATE TABLE IF NOT EXISTS users (
  id                SERIAL PRIMARY KEY,
  org_id            INTEGER,
  name              VARCHAR(120) NOT NULL,
  email             VARCHAR(255) NOT NULL UNIQUE,
  password_hash     VARCHAR(255) NOT NULL,
  two_factor_enabled BOOLEAN     NOT NULL DEFAULT FALSE,
  two_factor_secret  TEXT,
  is_super_admin     BOOLEAN     NOT NULL DEFAULT FALSE,
  is_active          BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- === ENTITLEMENTS ===========================================================
CREATE TABLE IF NOT EXISTS entitlements (
  id         SERIAL PRIMARY KEY,
  org_id     INTEGER     NOT NULL,
  feature_id INTEGER     NOT NULL,
  enabled    BOOLEAN     NOT NULL DEFAULT TRUE,
  value      TEXT,
  UNIQUE (org_id, feature_id)
);

-- Helpful indexes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname='public' AND indexname='entitlements_org_feature_idx'
  ) THEN
    CREATE INDEX entitlements_org_feature_idx ON entitlements (org_id, feature_id);
  END IF;
END $$;

-- === CLEANUP (optional): mark legacy string-id org rows so we don't pick them by name
UPDATE organizations
SET name = name || ' [legacy string-id — ignore]'
WHERE id::text !~ '^[0-9]+$' AND name NOT LIKE '%[legacy string-id — ignore]%';
