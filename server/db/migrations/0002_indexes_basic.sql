
create index if not exists idx_public_users_org_id on public_users (org_id);
create index if not exists idx_orders_created_at on orders (created_at desc);
