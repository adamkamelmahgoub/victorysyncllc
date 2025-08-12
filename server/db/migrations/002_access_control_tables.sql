
-- Add missing columns to public_users table
ALTER TABLE "public_users" ADD COLUMN IF NOT EXISTS "privileges" jsonb DEFAULT '[]'::jsonb;
ALTER TABLE "public_users" ADD COLUMN IF NOT EXISTS "account_locked" boolean DEFAULT false;
ALTER TABLE "public_users" ADD COLUMN IF NOT EXISTS "lock_reason" text;
ALTER TABLE "public_users" ADD COLUMN IF NOT EXISTS "session_count" integer DEFAULT 0;
ALTER TABLE "public_users" ADD COLUMN IF NOT EXISTS "ip_allowlist" jsonb DEFAULT '[]'::jsonb;
ALTER TABLE "public_users" ADD COLUMN IF NOT EXISTS "ip_denylist" jsonb DEFAULT '[]'::jsonb;

-- Create access control tables
CREATE TABLE IF NOT EXISTS "access_control_roles" (
  "id" serial PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" varchar(255),
  "is_system" boolean DEFAULT false,
  "permissions" jsonb DEFAULT '[]'::jsonb,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "access_control_user_roles" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL REFERENCES "public_users"("id") ON DELETE CASCADE,
  "role_id" integer NOT NULL REFERENCES "access_control_roles"("id") ON DELETE CASCADE,
  "org_id" varchar(255),
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "access_control_sessions" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL REFERENCES "public_users"("id") ON DELETE CASCADE,
  "session_id" varchar(255) NOT NULL,
  "device_info" varchar(500),
  "ip_address" varchar(45),
  "last_active" timestamp DEFAULT now(),
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "access_control_integrations" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL REFERENCES "public_users"("id") ON DELETE CASCADE,
  "provider" varchar(50) NOT NULL,
  "provider_id" varchar(255),
  "allowed_scopes" jsonb DEFAULT '[]'::jsonb,
  "denied_scopes" jsonb DEFAULT '[]'::jsonb,
  "credentials" jsonb,
  "last_sync" timestamp,
  "status" varchar(20) DEFAULT 'active',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "access_control_payment_methods" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL REFERENCES "public_users"("id") ON DELETE CASCADE,
  "allowed_methods" jsonb DEFAULT '["card"]'::jsonb,
  "default_method" varchar(50),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "access_control_call_metrics" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL REFERENCES "public_users"("id") ON DELETE CASCADE,
  "dialer_provider" varchar(50),
  "external_agent_id" varchar(255),
  "period" varchar(10) NOT NULL,
  "calls_count" integer DEFAULT 0,
  "avg_handle_time" integer,
  "occupancy" decimal(5,2),
  "live_status" varchar(20) DEFAULT 'offline',
  "updated_at" timestamp DEFAULT now()
);

-- Insert default system roles
INSERT INTO "access_control_roles" ("name", "description", "is_system", "permissions") VALUES
('superAdmin', 'Super Administrator with full access', true, '["*"]'::jsonb),
('admin', 'Administrator with most privileges', true, '["users:read", "users:write", "orders:read", "orders:write", "exports:run", "reports:read"]'::jsonb),
('manager', 'Manager with limited admin access', true, '["users:read", "orders:read", "exports:run", "reports:read"]'::jsonb),
('agent', 'Agent with basic access', true, '["orders:read", "profile:read", "profile:write"]'::jsonb),
('customer', 'Customer with minimal access', true, '["profile:read", "profile:write", "orders:read"]'::jsonb)
ON CONFLICT ("name") DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_access_control_user_roles_user_id" ON "access_control_user_roles"("user_id");
CREATE INDEX IF NOT EXISTS "idx_access_control_sessions_user_id" ON "access_control_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "idx_access_control_integrations_user_id" ON "access_control_integrations"("user_id");
CREATE INDEX IF NOT EXISTS "idx_access_control_payment_methods_user_id" ON "access_control_payment_methods"("user_id");
CREATE INDEX IF NOT EXISTS "idx_access_control_call_metrics_user_id" ON "access_control_call_metrics"("user_id");
CREATE INDEX IF NOT EXISTS "idx_public_users_privileges" ON "public_users" USING GIN("privileges");
