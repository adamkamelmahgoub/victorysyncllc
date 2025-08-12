
-- Create access_codes table if it doesn't exist
CREATE TABLE IF NOT EXISTS access_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  created_by INTEGER REFERENCES public_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Create user_registrations table to track registrations with access codes
CREATE TABLE IF NOT EXISTS user_registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public_users(id) ON DELETE CASCADE,
  access_code_id INTEGER REFERENCES access_codes(id) ON DELETE SET NULL,
  company_name VARCHAR(255),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create otp_codes table for email/SMS verification
CREATE TABLE IF NOT EXISTS otp_codes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public_users(id) ON DELETE CASCADE,
  code VARCHAR(10) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_active ON access_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_user_registrations_user_id ON user_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_codes_user_id ON otp_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_codes_code ON otp_codes(code);
CREATE INDEX IF NOT EXISTS idx_otp_codes_type ON otp_codes(type);

-- Ensure public_users table has all necessary columns
ALTER TABLE public_users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE public_users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE public_users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE public_users ADD COLUMN IF NOT EXISTS backup_codes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public_users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false;
ALTER TABLE public_users ADD COLUMN IF NOT EXISTS mfa_secret VARCHAR(32);
ALTER TABLE public_users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
