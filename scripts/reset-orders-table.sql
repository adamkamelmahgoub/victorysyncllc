
-- Script to reset orders table with correct types
-- Run this if you need to manually fix the orders table

DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  package_id INT,
  price NUMERIC(10,2) NOT NULL,
  discount_code TEXT,
  status TEXT NOT NULL DEFAULT 'paid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE orders ADD CONSTRAINT orders_package_id_fkey 
FOREIGN KEY (package_id) REFERENCES packages(id);
