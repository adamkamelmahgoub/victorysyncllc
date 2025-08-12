
-- users, orgs, roles, privileges, 2FA, payments, API keys, discount codes, calls

-- Use gen_random_uuid() instead of uuid_generate_v4() (no extension needed)

-- Check if organizations table exists and what type its ID column is
DO $$
BEGIN
  -- Drop and recreate organizations if it exists with wrong type
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'organizations'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'organizations' 
    AND column_name = 'id' 
    AND data_type = 'uuid'
  ) THEN
    DROP TABLE IF EXISTS organizations CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer');
  END IF;
END $$;

-- Check if users table exists and what type its ID column is
DO $$
BEGIN
  -- Drop and recreate users if it exists with wrong type
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'users'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'id' 
    AND data_type = 'uuid'
  ) THEN
    DROP TABLE IF EXISTS users CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  org_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  privileges JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of strings
  allowed_payment_methods JSONB NOT NULL DEFAULT '["card"]'::jsonb,
  twofa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  twofa_secret TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key for users.org_id after both tables are created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_org_id_fkey' 
    AND table_name = 'users'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_org_id_fkey 
    FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS access_codes (
  code TEXT PRIMARY KEY,
  description TEXT,
  max_uses INT,
  used INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  org_id UUID,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  scopes TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key constraints for api_keys after all referenced tables exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'api_keys_user_id_fkey' 
    AND table_name = 'api_keys'
  ) THEN
    ALTER TABLE api_keys ADD CONSTRAINT api_keys_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'api_keys_org_id_fkey' 
    AND table_name = 'api_keys'
  ) THEN
    ALTER TABLE api_keys ADD CONSTRAINT api_keys_org_id_fkey 
    FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,            -- 'hubspot','zoho','aircall','twilio', etc
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_integrations (
  user_id UUID,
  integration_id UUID,
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (user_id, integration_id)
);

-- Add foreign keys for user_integrations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_integrations_user_id_fkey' 
    AND table_name = 'user_integrations'
  ) THEN
    ALTER TABLE user_integrations ADD CONSTRAINT user_integrations_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_integrations_integration_id_fkey' 
    AND table_name = 'user_integrations'
  ) THEN
    ALTER TABLE user_integrations ADD CONSTRAINT user_integrations_integration_id_fkey 
    FOREIGN KEY (integration_id) REFERENCES integrations(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  minutes_included INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  package_id INT,
  price NUMERIC(10,2) NOT NULL,
  discount_code TEXT,
  status TEXT NOT NULL DEFAULT 'paid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign keys for orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'orders_user_id_fkey' 
    AND table_name = 'orders'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'orders_package_id_fkey' 
    AND table_name = 'orders'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_package_id_fkey 
    FOREIGN KEY (package_id) REFERENCES packages(id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS discount_codes (
  code TEXT PRIMARY KEY,
  percent_off INT CHECK (percent_off BETWEEN 0 AND 100),
  max_redemptions INT,
  redemption_count INT NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  org_id UUID,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_seconds INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed'
);

-- Add foreign keys for calls
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'calls_user_id_fkey' 
    AND table_name = 'calls'
  ) THEN
    ALTER TABLE calls ADD CONSTRAINT calls_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'calls_org_id_fkey' 
    AND table_name = 'calls'
  ) THEN
    ALTER TABLE calls ADD CONSTRAINT calls_org_id_fkey 
    FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key for audit_logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'audit_logs_actor_user_id_fkey' 
    AND table_name = 'audit_logs'
  ) THEN
    ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_actor_user_id_fkey 
    FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;
