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
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (keeping for potential future use)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Public users table for the new authentication system
export const publicUsers = pgTable("public_users", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash"),
  provider: varchar("provider").default("local"), // local, google, facebook, apple
  providerId: varchar("provider_id"),
  socialAccounts: jsonb("social_accounts").default([]), // Array of connected providers
  privileges: jsonb("privileges"), // User privileges and permissions
  isActive: boolean("is_active").default(true),
  role: varchar("role").default("customer"), // superAdmin, admin, manager, agent, customer
  permissions: jsonb("permissions").default([]), // Fine-grained permissions array
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaSecret: varchar("mfa_secret"), // encrypted
  backupCodes: jsonb("backup_codes").default([]), // encrypted array
  lastLoginAt: timestamp("last_login_at"),
  sessionCount: integer("session_count").default(0),
  ipAllowlist: jsonb("ip_allowlist").default([]),
  ipDenylist: jsonb("ip_denylist").default([]),
  accountLocked: boolean("account_locked").default(false),
  lockReason: text("lock_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Service packages
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  features: jsonb("features").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  status: varchar("status").default("pending"), // pending, processing, completed, cancelled
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  packageId: integer("package_id").references(() => packages.id),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  company: varchar("company"),
  message: text("message").notNull(),
  status: varchar("status").default("new"), // new, contacted, resolved
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
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

export const packagesRelations = relations(packages, ({ many }) => ({
  orderItems: many(orderItems),
}));

// Access Control Tables
export const userFeatureFlags = pgTable("user_feature_flags", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => publicUsers.id).notNull(),
  flagKey: varchar("flag_key").notNull(),
  value: boolean("value").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userIntegrationPolicies = pgTable("user_integration_policies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => publicUsers.id).notNull(),
  provider: varchar("provider").notNull(), // twilio, ringcentral, five9, hubspot, salesforce, etc.
  allowedScopes: jsonb("allowed_scopes").notNull().default([]),
  deniedScopes: jsonb("denied_scopes").notNull().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orgIntegrationPolicies = pgTable("org_integration_policies", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(), // Will reference orgs table when created
  provider: varchar("provider").notNull(),
  allowedScopes: jsonb("allowed_scopes").notNull().default([]),
  deniedScopes: jsonb("denied_scopes").notNull().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userPaymentPolicies = pgTable("user_payment_policies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => publicUsers.id).notNull(),
  allowedMethods: jsonb("allowed_methods").notNull().default(["card"]), // card, ach_debit, bank_transfer, wire, paypal
  defaultMethod: varchar("default_method").default("card"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orgPaymentPolicies = pgTable("org_payment_policies", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  allowedMethods: jsonb("allowed_methods").notNull().default(["card"]),
  defaultMethod: varchar("default_method").default("card"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userDialerMap = pgTable("user_dialer_map", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => publicUsers.id).notNull(),
  provider: varchar("provider").notNull(), // twilio, five9, ringcentral
  externalAgentId: varchar("external_agent_id").notNull(),
  meta: jsonb("meta").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actorUserId: integer("actor_user_id").references(() => publicUsers.id).notNull(),
  targetUserId: integer("target_user_id").references(() => publicUsers.id),
  targetOrgId: integer("target_org_id"),
  action: varchar("action").notNull(),
  before: jsonb("before"),
  after: jsonb("after"),
  ip: varchar("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id"),
  userId: integer("user_id").references(() => publicUsers.id),
  keyHash: varchar("key_hash").notNull(),
  label: varchar("label").notNull(),
  scopes: jsonb("scopes").notNull().default([]),
  ipAllowlist: jsonb("ip_allowlist").default([]),
  rateLimitPerMin: integer("rate_limit_per_min").default(100),
  createdBy: integer("created_by").references(() => publicUsers.id).notNull(),
  lastUsedAt: timestamp("last_used_at"),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const callsCache = pgTable("calls_cache", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => publicUsers.id).notNull(),
  period: varchar("period").notNull(), // today, 7d, 30d
  callsCount: integer("calls_count").default(0),
  avgHandleTime: decimal("avg_handle_time", { precision: 10, scale: 2 }).default("0"),
  occupancy: decimal("occupancy", { precision: 5, scale: 2 }).default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code").unique().notNull(),
  description: text("description"),
  discountType: varchar("discount_type").notNull(), // percentage, fixed
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  maxUses: integer("max_uses"),
  usesCount: integer("uses_count").default(0),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => publicUsers.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const couponRedemptions = pgTable("coupon_redemptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => publicUsers.id).notNull(),
  couponId: integer("coupon_id").references(() => coupons.id).notNull(),
  orderId: integer("order_id").references(() => orders.id),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Types
export type InsertPublicUser = typeof publicUsers.$inferInsert;
export type PublicUser = typeof publicUsers.$inferSelect;

export type InsertPackage = typeof packages.$inferInsert;
export type Package = typeof packages.$inferSelect;

export type InsertOrder = typeof orders.$inferInsert;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = typeof orderItems.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Access Control Types
export type InsertUserFeatureFlag = typeof userFeatureFlags.$inferInsert;
export type UserFeatureFlag = typeof userFeatureFlags.$inferSelect;

export type InsertUserIntegrationPolicy = typeof userIntegrationPolicies.$inferInsert;
export type UserIntegrationPolicy = typeof userIntegrationPolicies.$inferSelect;

export type InsertOrgIntegrationPolicy = typeof orgIntegrationPolicies.$inferInsert;
export type OrgIntegrationPolicy = typeof orgIntegrationPolicies.$inferSelect;

export type InsertUserPaymentPolicy = typeof userPaymentPolicies.$inferInsert;
export type UserPaymentPolicy = typeof userPaymentPolicies.$inferSelect;

export type InsertOrgPaymentPolicy = typeof orgPaymentPolicies.$inferInsert;
export type OrgPaymentPolicy = typeof orgPaymentPolicies.$inferSelect;

export type InsertUserDialerMap = typeof userDialerMap.$inferInsert;
export type UserDialerMap = typeof userDialerMap.$inferSelect;

export type InsertAuditLog = typeof auditLogs.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;

export type InsertApiKey = typeof apiKeys.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;

export type InsertCallsCache = typeof callsCache.$inferInsert;
export type CallsCache = typeof callsCache.$inferSelect;

export type InsertCoupon = typeof coupons.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;

export type InsertCouponRedemption = typeof couponRedemptions.$inferInsert;
export type CouponRedemption = typeof couponRedemptions.$inferSelect;

// Schemas
export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const registerUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/\d/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Access Control Tables - New comprehensive tables for admin access control
export const accessControlRoles = pgTable('access_control_roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  description: varchar('description', { length: 255 }),
  isSystem: boolean('is_system').default(false),
  permissions: jsonb('permissions').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const accessControlUserRoles = pgTable('access_control_user_roles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => publicUsers.id, { onDelete: 'cascade' }),
  roleId: integer('role_id').notNull().references(() => accessControlRoles.id, { onDelete: 'cascade' }),
  orgId: varchar('org_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const accessControlSessions = pgTable('access_control_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => publicUsers.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  deviceInfo: varchar('device_info', { length: 500 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  lastActive: timestamp('last_active').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const accessControlIntegrations = pgTable('access_control_integrations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => publicUsers.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 50 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }),
  allowedScopes: jsonb('allowed_scopes').$type<string[]>().default([]),
  deniedScopes: jsonb('denied_scopes').$type<string[]>().default([]),
  credentials: jsonb('credentials'), // encrypted
  lastSync: timestamp('last_sync'),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const accessControlPaymentMethods = pgTable('access_control_payment_methods', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => publicUsers.id, { onDelete: 'cascade' }),
  allowedMethods: jsonb('allowed_methods').$type<string[]>().default(['card']),
  defaultMethod: varchar('default_method', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const accessControlCallMetrics = pgTable('access_control_call_metrics', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => publicUsers.id, { onDelete: 'cascade' }),
  dialerProvider: varchar('dialer_provider', { length: 50 }),
  externalAgentId: varchar('external_agent_id', { length: 255 }),
  period: varchar('period', { length: 10 }).notNull(), // 'today', '7d', '30d'
  callsCount: integer('calls_count').default(0),
  avgHandleTime: integer('avg_handle_time'), // seconds
  occupancy: decimal('occupancy', { precision: 5, scale: 2 }), // percentage
  liveStatus: varchar('live_status', { length: 20 }).default('offline'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Insert schemas for access control
export const insertAccessControlRoleSchema = createInsertSchema(accessControlRoles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccessControlUserRoleSchema = createInsertSchema(accessControlUserRoles).omit({
  id: true,
  createdAt: true,
});

export const insertAccessControlSessionSchema = createInsertSchema(accessControlSessions).omit({
  id: true,
  createdAt: true,
});

export const insertAccessControlIntegrationSchema = createInsertSchema(accessControlIntegrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccessControlPaymentMethodSchema = createInsertSchema(accessControlPaymentMethods).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccessControlCallMetricsSchema = createInsertSchema(accessControlCallMetrics).omit({
  id: true,
  updatedAt: true,
});

// Access Control Types
export type AccessControlRole = typeof accessControlRoles.$inferSelect;
export type InsertAccessControlRole = typeof accessControlRoles.$inferInsert;
export type AccessControlUserRole = typeof accessControlUserRoles.$inferSelect;
export type InsertAccessControlUserRole = typeof accessControlUserRoles.$inferInsert;
export type AccessControlSession = typeof accessControlSessions.$inferSelect;
export type InsertAccessControlSession = typeof accessControlSessions.$inferInsert;
export type AccessControlIntegration = typeof accessControlIntegrations.$inferSelect;
export type InsertAccessControlIntegration = typeof accessControlIntegrations.$inferInsert;
export type AccessControlPaymentMethod = typeof accessControlPaymentMethods.$inferSelect;
export type InsertAccessControlPaymentMethod = typeof accessControlPaymentMethods.$inferInsert;
export type AccessControlCallMetric = typeof accessControlCallMetrics.$inferSelect;
export type InsertAccessControlCallMetric = typeof accessControlCallMetrics.$inferInsert;