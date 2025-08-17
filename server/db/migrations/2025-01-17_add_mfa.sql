
-- 2025-01-17_add_mfa.sql

-- Add user MFA columns (ADD-ONLY)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS mfa_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS mfa_secret_encrypted text;

-- MFA backup codes table
CREATE TABLE IF NOT EXISTS mfa_backup_codes (
  id               serial PRIMARY KEY,
  user_id          integer NOT NULL,
  code_hash        text   NOT NULL,
  used_at          timestamp,
  created_at       timestamp NOT NULL DEFAULT now(),
  CONSTRAINT fk_mfa_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

-- Optional: tighten things up
CREATE INDEX IF NOT EXISTS idx_mfa_codes_user ON mfa_backup_codes(user_id);
