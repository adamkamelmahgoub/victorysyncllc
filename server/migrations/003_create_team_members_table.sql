-- Create team_members table for seat-based billing
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES public_users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  stripe_subscription_item_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, email)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_members_customer_id ON team_members(customer_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);

-- Trigger functions removed due to migration parsing issues
-- The updated_at field will have a default value but won't auto-update