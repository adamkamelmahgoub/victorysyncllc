
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  org_id INTEGER REFERENCES organizations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- roles & permissions
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- access codes for controlled signup
CREATE TABLE IF NOT EXISTS access_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  phone TEXT,
  org_name TEXT NOT NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ
);

-- basic orders/packages (already referenced by server)
CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  price NUMERIC(12,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  org_id INTEGER REFERENCES organizations(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','processing','completed','cancelled','refunded')) DEFAULT 'pending',
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  external_id TEXT,
  customer_name TEXT,
  customer_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  package_id INTEGER REFERENCES packages(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  price_at_time NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
