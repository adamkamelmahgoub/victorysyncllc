-- Create features_enabled table for feature flags
CREATE TABLE IF NOT EXISTS features_enabled (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES public_users(id) ON DELETE CASCADE,
  feature_key VARCHAR(100) NOT NULL,
  enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, feature_key)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_features_customer_id ON features_enabled(customer_id);
CREATE INDEX IF NOT EXISTS idx_features_feature_key ON features_enabled(feature_key);

-- Insert default features for existing customers
INSERT INTO features_enabled (customer_id, feature_key, enabled)
SELECT id, 'kpi_tracker', true FROM public_users
ON CONFLICT (customer_id, feature_key) DO NOTHING;

INSERT INTO features_enabled (customer_id, feature_key, enabled)
SELECT id, 'integrations', true FROM public_users
ON CONFLICT (customer_id, feature_key) DO NOTHING;

INSERT INTO features_enabled (customer_id, feature_key, enabled)
SELECT id, 'billing', true FROM public_users
ON CONFLICT (customer_id, feature_key) DO NOTHING;

INSERT INTO features_enabled (customer_id, feature_key, enabled)
SELECT id, 'team_members', true FROM public_users
ON CONFLICT (customer_id, feature_key) DO NOTHING;

INSERT INTO features_enabled (customer_id, feature_key, enabled)
SELECT id, 'support_tickets', true FROM public_users
ON CONFLICT (customer_id, feature_key) DO NOTHING;