
import { pgTable, serial, varchar, text, timestamp, boolean, integer, decimal, jsonb, uuid, index, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Organizations
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, suspended
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('org_slug_idx').on(table.slug),
}));

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  twoFactorSecret: text('two_factor_secret'), // encrypted
  isSuperAdmin: boolean('is_super_admin').default(false).notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  orgIdx: index('users_org_idx').on(table.orgId),
}));

// Roles
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  isSystem: boolean('is_system').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  orgIdx: index('roles_org_idx').on(table.orgId),
}));

// Permissions
export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  description: text('description'),
}, (table) => ({
  keyIdx: index('permissions_key_idx').on(table.key),
}));

// Role Permissions (junction table)
export const rolePermissions = pgTable('role_permissions', {
  roleId: integer('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
  permissionId: integer('permission_id').references(() => permissions.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
}));

// User Roles (junction table)
export const userRoles = pgTable('user_roles', {
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  roleId: integer('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.roleId] }),
}));

// Access Codes
export const accessCodes = pgTable('access_codes', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  orgId: integer('org_id').references(() => organizations.id),
  issuedByUserId: integer('issued_by_user_id').references(() => users.id),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, used, revoked, expired
  expiresAt: timestamp('expires_at').notNull(),
  consumedByUserId: integer('consumed_by_user_id').references(() => users.id),
  consumedAt: timestamp('consumed_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  codeIdx: index('access_codes_code_idx').on(table.code),
  statusIdx: index('access_codes_status_idx').on(table.status),
}));

// API Credentials
export const apiCredentials = pgTable('api_credentials', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // hubspot, salesforce, etc.
  authType: varchar('auth_type', { length: 20 }).notNull(), // oauth, apikey
  data: text('data').notNull(), // encrypted JSON
  status: varchar('status', { length: 20 }).notNull().default('active'),
  lastSyncAt: timestamp('last_sync_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  orgProviderIdx: index('api_creds_org_provider_idx').on(table.orgId, table.provider),
}));

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id),
  actorUserId: integer('actor_user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: varchar('entity_id', { length: 100 }),
  meta: jsonb('meta'),
  ip: varchar('ip', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  orgCreatedIdx: index('audit_logs_org_created_idx').on(table.orgId, table.createdAt),
  actorIdx: index('audit_logs_actor_idx').on(table.actorUserId),
}));

// Subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id).notNull(),
  plan: varchar('plan', { length: 20 }).notNull(), // basic, growth, scale
  status: varchar('status', { length: 20 }).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 100 }),
  stripeSubId: varchar('stripe_sub_id', { length: 100 }),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  orgIdx: index('subscriptions_org_idx').on(table.orgId),
}));

// Invoices
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id).notNull(),
  stripeInvoiceId: varchar('stripe_invoice_id', { length: 100 }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  hostedInvoiceUrl: text('hosted_invoice_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  orgIdx: index('invoices_org_idx').on(table.orgId),
}));

// Tickets
export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id).notNull(),
  createdByUserId: integer('created_by_user_id').references(() => users.id).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).notNull().default('open'), // open, in_progress, closed
  priority: varchar('priority', { length: 20 }).notNull().default('medium'), // low, medium, high, urgent
  assignedToUserId: integer('assigned_to_user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  orgIdx: index('tickets_org_idx').on(table.orgId),
  statusIdx: index('tickets_status_idx').on(table.status),
}));

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id).notNull(),
  externalId: varchar('external_id', { length: 100 }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  status: varchar('status', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  orgIdx: index('orders_org_idx').on(table.orgId),
}));

// KPIs Daily
export const kpisDaily = pgTable('kpis_daily', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id).notNull(),
  date: timestamp('date').notNull(),
  calls: integer('calls').default(0).notNull(),
  avgResponseSec: integer('avg_response_sec').default(0).notNull(),
  csat: decimal('csat', { precision: 3, scale: 2 }),
  ahtSec: integer('aht_sec').default(0).notNull(),
  notes: text('notes'),
}, (table) => ({
  orgDateIdx: index('kpis_daily_org_date_idx').on(table.orgId, table.date),
}));

// Rate Limits
export const rateLimits = pgTable('rate_limits', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id),
  key: varchar('key', { length: 100 }).notNull(),
  count: integer('count').notNull().default(0),
  windowExpiresAt: timestamp('window_expires_at').notNull(),
}, (table) => ({
  orgKeyIdx: index('rate_limits_org_key_idx').on(table.orgId, table.key),
}));

// Feature Flags
export const featureFlags = pgTable('feature_flags', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id),
  key: varchar('key', { length: 100 }).notNull(),
  enabled: boolean('enabled').default(false).notNull(),
  value: jsonb('value'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  orgKeyIdx: index('feature_flags_org_key_idx').on(table.orgId, table.key),
}));

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  roles: many(roles),
  accessCodes: many(accessCodes),
  apiCredentials: many(apiCredentials),
  auditLogs: many(auditLogs),
  subscriptions: many(subscriptions),
  invoices: many(invoices),
  tickets: many(tickets),
  orders: many(orders),
  kpisDaily: many(kpisDaily),
  rateLimits: many(rateLimits),
  featureFlags: many(featureFlags),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.orgId],
    references: [organizations.id],
  }),
  issuedAccessCodes: many(accessCodes, { relationName: 'issuedBy' }),
  consumedAccessCodes: many(accessCodes, { relationName: 'consumedBy' }),
  auditLogs: many(auditLogs),
  createdTickets: many(tickets, { relationName: 'createdBy' }),
  assignedTickets: many(tickets, { relationName: 'assignedTo' }),
  userRoles: many(userRoles),
}));

export const rolesRelations = relations(roles, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [roles.orgId],
    references: [organizations.id],
  }),
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));
