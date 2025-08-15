import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  pgEnum,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const orgStatusEnum = pgEnum("org_status", ["active", "suspended"]);
export const accessCodeStatusEnum = pgEnum("access_code_status", ["active", "used", "revoked", "expired"]);
export const providerEnum = pgEnum("provider", [
  "hubspot", "salesforce", "zoho", "pipedrive",
  "five9", "ringcentral", "twilio", "aircall",
  "zendesk", "freshdesk", "intercom", "helpscout"
]);
export const authTypeEnum = pgEnum("auth_type", ["oauth", "apikey"]);
export const planEnum = pgEnum("plan", ["basic", "growth", "scale"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "past_due", "canceled", "unpaid"]);
export const ticketStatusEnum = pgEnum("ticket_status", ["open", "in_progress", "resolved", "closed"]);
export const ticketPriorityEnum = pgEnum("ticket_priority", ["low", "medium", "high", "urgent"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "completed", "cancelled"]);

// Organizations
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  status: orgStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users (enhanced with 2FA and org relationship)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }),
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  twoFactorSecret: text("two_factor_secret"), // encrypted
  isSuperAdmin: boolean("is_super_admin").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  emailVerificationToken: varchar("email_verification_token"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

// Roles
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id), // nullable for global roles
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  isSystem: boolean("is_system").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Permissions
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Role Permissions
export const rolePermissions = pgTable("role_permissions", {
  roleId: integer("role_id").references(() => roles.id).notNull(),
  permissionId: integer("permission_id").references(() => permissions.id).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
}));

// User Roles
export const userRoles = pgTable("user_roles", {
  userId: integer("user_id").references(() => users.id).notNull(),
  roleId: integer("role_id").references(() => roles.id).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.roleId] }),
}));

// Access Codes
export const accessCodes = pgTable("access_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  orgId: integer("org_id").references(() => organizations.id),
  issuedByUserId: integer("issued_by_user_id").references(() => users.id).notNull(),
  status: accessCodeStatusEnum("status").default("active").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  consumedByUserId: integer("consumed_by_user_id").references(() => users.id),
  consumedAt: timestamp("consumed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// API Credentials
export const apiCredentials = pgTable("api_credentials", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id).notNull(),
  provider: providerEnum("provider").notNull(),
  authType: authTypeEnum("auth_type").notNull(),
  data: text("data").notNull(), // encrypted JSON
  status: varchar("status", { length: 50 }).default("active").notNull(),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id), // nullable for global actions
  actorUserId: integer("actor_user_id").references(() => users.id), // nullable for system actions
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: varchar("entity_id", { length: 50 }),
  meta: jsonb("meta"),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("audit_logs_org_created_idx").on(table.orgId, table.createdAt),
  index("audit_logs_actor_idx").on(table.actorUserId),
]);

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id).notNull(),
  plan: planEnum("plan").notNull(),
  status: subscriptionStatusEnum("status").notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 100 }),
  stripeSubId: varchar("stripe_sub_id", { length: 100 }),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Invoices
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id).notNull(),
  stripeInvoiceId: varchar("stripe_invoice_id", { length: 100 }).unique().notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  hostedInvoiceUrl: text("hosted_invoice_url"),
  invoicePdf: text("invoice_pdf"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tickets
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id).notNull(),
  createdByUserId: integer("created_by_user_id").references(() => users.id).notNull(),
  assignedToUserId: integer("assigned_to_user_id").references(() => users.id),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description"),
  status: ticketStatusEnum("status").default("open").notNull(),
  priority: ticketPriorityEnum("priority").default("medium").notNull(),
  externalId: varchar("external_id", { length: 100 }), // for integration sync
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  orgId: integer("org_id").references(() => organizations.id),
  externalId: varchar("external_id", { length: 100 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  customerName: varchar("customer_name", { length: 255 }),
  customerEmail: varchar("customer_email", { length: 255 }),
  source: varchar("source", { length: 50 }), // which integration
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// KPI Daily Metrics
export const kpisDaily = pgTable("kpis_daily", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id).notNull(),
  date: timestamp("date").notNull(),
  calls: integer("calls").default(0).notNull(),
  avgResponseSec: integer("avg_response_sec").default(0).notNull(),
  csat: decimal("csat", { precision: 3, scale: 2 }).default("0").notNull(),
  ahtSec: integer("aht_sec").default(0).notNull(), // average handle time
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("kpis_daily_org_date_idx").on(table.orgId, table.date),
  unique("kpis_daily_org_date_unique").on(table.orgId, table.date),
]);

// Rate Limits
export const rateLimits = pgTable("rate_limits", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id),
  key: varchar("key", { length: 100 }).notNull(),
  count: integer("count").default(0).notNull(),
  windowExpiresAt: timestamp("window_expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("rate_limits_key_idx").on(table.key, table.windowExpiresAt),
]);

// Feature Flags
export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id), // nullable for global flags
  key: varchar("key", { length: 100 }).notNull(),
  enabled: boolean("enabled").default(false).notNull(),
  value: jsonb("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// API Keys (Personal Access Tokens)
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  orgId: integer("org_id").references(() => organizations.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  keyHash: varchar("key_hash", { length: 255 }).notNull(),
  lastFour: varchar("last_four", { length: 4 }).notNull(),
  expiresAt: timestamp("expires_at"),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sessions for refresh tokens
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  refreshTokenHash: varchar("refresh_token_hash", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("sessions_user_idx").on(table.userId),
  index("sessions_expires_idx").on(table.expiresAt),
]);

// New tables for contact submissions, packages, public users, and order items
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  features: jsonb("features"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const publicUsers = pgTable("public_users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }),
  provider: varchar("provider", { length: 50 }).default("local"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  packageId: integer("package_id").references(() => packages.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  users: many(users),
  roles: many(roles),
  accessCodes: many(accessCodes),
  apiCredentials: many(apiCredentials),
  subscriptions: many(subscriptions),
  invoices: many(invoices),
  tickets: many(tickets),
  orders: many(orders),
  kpisDaily: many(kpisDaily),
  rateLimits: many(rateLimits),
  featureFlags: many(featureFlags),
  apiKeys: many(apiKeys),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.orgId],
    references: [organizations.id],
  }),
  userRoles: many(userRoles),
  issuedAccessCodes: many(accessCodes, {
    relationName: "issuedAccessCodes",
  }),
  consumedAccessCodes: many(accessCodes, {
    relationName: "consumedAccessCodes",
  }),
  createdTickets: many(tickets, {
    relationName: "createdTickets",
  }),
  assignedTickets: many(tickets, {
    relationName: "assignedTickets",
  }),
  apiKeys: many(apiKeys),
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

// Relations for new tables
export const contactSubmissionsRelations = relations(contactSubmissions, () => ({
  // No relations defined for contactSubmissions yet
}));

export const packagesRelations = relations(packages, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const publicUsersRelations = relations(publicUsers, () => ({
  // No relations defined for publicUsers yet
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  package: one(packages, {
    fields: [orderItems.packageId],
    references: [packages.id],
  }),
}));


// Types
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = typeof permissions.$inferInsert;
export type AccessCode = typeof accessCodes.$inferSelect;
export type InsertAccessCode = typeof accessCodes.$inferInsert;
export type ApiCredential = typeof apiCredentials.$inferSelect;
export type InsertApiCredential = typeof apiCredentials.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type KpiDaily = typeof kpisDaily.$inferSelect;
export type InsertKpiDaily = typeof kpisDaily.$inferInsert;
export type RateLimit = typeof rateLimits.$inferSelect;
export type InsertRateLimit = typeof rateLimits.$inferInsert;
export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = typeof featureFlags.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

// Types for new tables
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;
export type Package = typeof packages.$inferSelect;
export type InsertPackage = typeof packages.$inferInsert;
export type PublicUser = typeof publicUsers.$inferSelect;
export type InsertPublicUser = typeof publicUsers.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;


// Validation Schemas
export const createOrgSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
});

export const registerUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8).regex(/(?=.*\d)/, "Password must contain at least one number"),
});

export const registerWithCodeSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8).regex(/(?=.*\d)/, "Password must contain at least one number"),
  accessCode: z.string().min(1),
});

export const createAccessCodeSchema = z.object({
  orgName: z.string().optional(),
  expiresAt: z.string().datetime(),
  notes: z.string().optional(),
});

export const createRoleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  permissions: z.array(z.string()),
});

export const inviteUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  roleIds: z.array(z.number()).min(1),
});

export const createTicketSchema = z.object({
  subject: z.string().min(1).max(255),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
});

export const kpiFilterSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const verify2faSchema = z.object({
  token: z.string().length(6).regex(/^\d{6}$/),
});

export const enroll2faSchema = z.object({
  token: z.string().length(6).regex(/^\d{6}$/),
  secret: z.string(),
});

export const connectIntegrationSchema = z.object({
  provider: z.enum(["hubspot", "salesforce", "zoho", "pipedrive", "five9", "ringcentral", "twilio", "aircall", "zendesk", "freshdesk", "intercom", "helpscout"]),
  authType: z.enum(["oauth", "apikey"]),
  credentials: z.record(z.string()),
});

// Insert schemas for validation
export const insertContactSubmissionSchema = z.object({
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  email: z.string().email(),
  message: z.string().min(1),
});

export const insertOrderSchema = z.object({
  userId: z.string().min(1),
  orgId: z.number().optional(),
  externalId: z.string().optional(),
  amount: z.string().regex(/^\d+\.\d{2}$/),
  currency: z.string().length(3).default("usd"),
  status: z.enum(["pending", "processing", "completed", "cancelled"]).default("pending"),
  customerName: z.string().max(255).optional(),
  customerEmail: z.string().email().optional(),
  source: z.string().max(50).optional(),
  total: z.string().regex(/^\d+\.\d{2}$/),
  stripePaymentIntentId: z.string().optional(),
});

export const insertOrderItemSchema = z.object({
  orderId: z.number(),
  packageId: z.number(),
  quantity: z.number().positive(),
  price: z.string().regex(/^\d+\.\d{2}$/),
});

export const insertPackageSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.string().regex(/^\d+\.\d{2}$/),
  currency: z.string().length(3).default("usd"),
  features: z.array(z.string()).optional(),
});