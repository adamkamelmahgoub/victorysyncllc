
alter table if exists public_users
  add column if not exists privileges jsonb default '{}'::jsonb;
