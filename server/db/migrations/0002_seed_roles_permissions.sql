
INSERT INTO roles (key, name)
  VALUES ('super_admin','Super Admin'), ('org_admin','Org Admin'), ('agent','Agent')
ON CONFLICT (key) DO NOTHING;

INSERT INTO permissions (key, description) VALUES
  ('manage_admins','Full control over admins and customers'),
  ('manage_orgs','Create/disable organizations'),
  ('manage_integrations','Enable/disable API & CRM/dialer integrations'),
  ('manage_billing','Control payment methods, issue discounts'),
  ('view_kpis','View KPIs and analytics'),
  ('manage_access_codes','Issue/void signup access codes')
ON CONFLICT (key) DO NOTHING;

-- map all permissions to super_admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.key='super_admin'
ON CONFLICT DO NOTHING;

-- org_admin gets a subset
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r
JOIN permissions p ON p.key IN ('manage_orgs','manage_integrations','manage_billing','view_kpis','manage_access_codes')
WHERE r.key='org_admin'
ON CONFLICT DO NOTHING;
