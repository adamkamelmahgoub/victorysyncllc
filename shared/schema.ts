
import { pgTable, serial, text, timestamp, boolean, integer, decimal, json, varchar, unique, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const organizationStatusEnum = pgEnum('organization_status', ['active', 'suspended']);
export const accessCodeStatusEnum = pgEnum('access_code_status', ['active', 'used', 'revoked', 'expired']);
export const providerEnum = pgEnum('provider', [
  'hubspot', 'salesforce', 'zoho', 'pipedrive', 
  'five9', 'ringcentral', 'twilio', 'aircall',
  'zendesk', 'freshdesk', 'intercom', 'helpscout'
]);
export const authTypeEnum = pgEnum('auth_type', ['oauth', 'apikey']);
export const planEnum = pgEnum('plan', ['basic', 'growth', 'scale']);
export const ticketStatusEnum = pgEnum('ticket_status', ['open', 'in_progress', 'resolved', 'closed']);
export const ticketPriorityEnum = pgEnum('ticket_priority', ['low', 'medium', 'high', 'urgent']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'completed', 'cancelled', 'refunded']);

// Organizations
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  status: organizationStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
  twoFactorSecret: text('two_factor_secret'),
  isSuperAdmin: boolean('is_super_admin').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  emailVerified: boolean('email_verified').notNull().default(false),
  emailVerificationToken: text('email_verification_token'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
});

// Roles
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  isSystem: boolean('is_system').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueNamePerOrg: unique().on(table.orgId, table.name),
}));

// Permissions
export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  description: text('description').notNull(),
});

// Role Permissions
export const rolePermissions = pgTable('role_permissions', {
  roleId: integer('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: integer('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: unique().on(table.roleId, table.permissionId),
}));

// User Roles
export const userRoles = pgTable('user_roles', {
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  roleId: integer('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: unique().on(table.userId, table.roleId),
}));

// Access Codes
export const accessCodes = pgTable('access_codes', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  orgId: integer('org_id').references(() => organizations.id, { onDelete: 'cascade' }),
  issuedByUserId: integer('issued_by_user_id').notNull().references(() => users.id),
  status: accessCodeStatusEnum('status').notNull().default('active'),
  expiresAt: timestamp('expires_at').notNull(),
  consumedByUserId: integer('consumed_by_user_id').references(() => users.id),
  consumedAt: timestamp('consumed_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// API Credentials
export const apiCredentials = pgTable('api_credentials', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  provider: providerEnum('provider').notNull(),
  authType: authTypeEnum('auth_type').notNull(),
  data: text('data').notNull(), // encrypted JSON
  status: text('status').notNull().default('active'),
  lastSyncAt: timestamp('last_sync_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueProviderPerOrg: unique().on(table.orgId, table.provider),
}));

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id, { onDelete: 'cascade' }),
  actorUserId: integer('actor_user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  meta: json('meta'),
  ip: text('ip'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }).unique(),
  plan: planEnum('plan').notNull().default('basic'),
  status: text('status').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubId: text('stripe_sub_id'),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Invoices
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  stripeInvoiceId: text('stripe_invoice_id').notNull().unique(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull(),
  hostedInvoiceUrl: text('hosted_invoice_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Tickets
export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  createdByUserId: integer('created_by_user_id').notNull().references(() => users.id),
  subject: text('subject').notNull(),
  description: text('description'),
  status: ticketStatusEnum('status').notNull().default('open'),
  priority: ticketPriorityEnum('priority').notNull().default('medium'),
  assignedToUserId: integer('assigned_to_user_id').references(() => users.id),
  externalId: text('external_id'), // for synced tickets
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  externalId: text('external_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  status: orderStatusEnum('status').notNull().default('pending'),
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueExternalIdPerOrg: unique().on(table.orgId, table.externalId),
}));

// KPIs Daily
export const kpisDaily = pgTable('kpis_daily', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  calls: integer('calls').notNull().default(0),
  avgResponseSec: integer('avg_response_sec').notNull().default(0),
  csat: decimal('csat', { precision: 5, scale: 2 }).notNull().default('0'),
  ahtSec: integer('aht_sec').notNull().default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueDatePerOrg: unique().on(table.orgId, table.date),
}));

// Rate Limits
export const rateLimits = pgTable('rate_limits', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  count: integer('count').notNull().default(0),
  windowExpiresAt: timestamp('window_expires_at').notNull(),
}, (table) => ({
  uniqueKeyPerOrg: unique().on(table.orgId, table.key),
}));

// Feature Flags
export const featureFlags = pgTable('feature_flags', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => organizations.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  enabled: boolean('enabled').notNull().default(false),
  value: json('value'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueKeyPerOrg: unique().on(table.orgId, table.key),
}));

// Sessions
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

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
  userRoles: many(userRoles),
  issuedAccessCodes: many(accessCodes, { relationName: "issuedAccessCodes" }),
  consumedAccessCodes: many(accessCodes, { relationName: "consumedAccessCodes" }),
  auditLogs: many(auditLogs),
  createdTickets: many(tickets, { relationName: "createdTickets" }),
  assignedTickets: many(tickets, { relationName: "assignedTickets" }),
  sessions: many(sessions),
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

export const accessCodesRelations = relations(accessCodes, ({ one }) => ({
  organization: one(organizations, {
    fields: [accessCodes.orgId],
    references: [organizations.id],
  }),
  issuedBy: one(users, {
    fields: [accessCodes.issuedByUserId],
    references: [users.id],
    relationName: "issuedAccessCodes",
  }),
  consumedBy: one(users, {
    fields: [accessCodes.consumedByUserId],
    references: [users.id],
    relationName: "consumedAccessCodes",
  }),
}));

export const apiCredentialsRelations = relations(apiCredentials, ({ one }) => ({
  organization: one(organizations, {
    fields: [apiCredentials.orgId],
    references: [organizations.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  organization: one(organizations, {
    fields: [auditLogs.orgId],
    references: [organizations.id],
  }),
  actor: one(users, {
    fields: [auditLogs.actorUserId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  organization: one(organizations, {
    fields: [subscriptions.orgId],
    references: [organizations.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  organization: one(organizations, {
    fields: [invoices.orgId],
    references: [organizations.id],
  }),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  organization: one(organizations, {
    fields: [tickets.orgId],
    references: [organizations.id],
  }),
  createdBy: one(users, {
    fields: [tickets.createdByUserId],
    references: [users.id],
    relationName: "createdTickets",
  }),
  assignedTo: one(users, {
    fields: [tickets.assignedToUserId],
    references: [users.id],
    relationName: "assignedTickets",
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  organization: one(organizations, {
    fields: [orders.orgId],
    references: [organizations.id],
  }),
}));

export const kpisDailyRelations = relations(kpisDaily, ({ one }) => ({
  organization: one(organizations, {
    fields: [kpisDaily.orgId],
    references: [organizations.id],
  }),
}));

export const rateLimitsRelations = relations(rateLimits, ({ one }) => ({
  organization: one(organizations, {
    fields: [rateLimits.orgId],
    references: [organizations.id],
  }),
}));

export const featureFlagsRelations = relations(featureFlags, ({ one }) => ({
  organization: one(organizations, {
    fields: [featureFlags.orgId],
    references: [organizations.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
