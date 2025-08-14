
-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id SERIAL PRIMARY KEY,
  customer_id TEXT NOT NULL,
  type TEXT NOT NULL, 
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create unique constraint to prevent duplicate integrations per customer
CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_integration 
ON integrations (customer_id, type);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_integrations_customer_id 
ON integrations (customer_id);

-- Create index for active integrations
CREATE INDEX IF NOT EXISTS idx_integrations_active 
ON integrations (is_active);
