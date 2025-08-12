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



// Access Control Tables
export const userFeatureFlags = pgTable('user_feature_flags', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => publicUsers.id, { onDelete: 'cascade' }),
  flagKey: varchar('flag_key', { length: 100 }).notNull(),
  value: boolean('value').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userIntegrationPolicies = pgTable('user_integration_policies', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => publicUsers.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 50 }).notNull(),
  allowedScopes: jsonb('allowed_scopes').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orgIntegrationPolicies = pgTable('org_integration_policies', {
  id: serial('id').primaryKey(),
  orgId: varchar('org_id', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  allowedScopes: jsonb('allowed_scopes').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userPaymentPolicies = pgTable('user_payment_policies', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => publicUsers.id, { onDelete: 'cascade' }),
  allowedMethods: jsonb('allowed_methods').$type<string[]>().default(['card']),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orgPaymentPolicies = pgTable('org_payment_policies', {
  id: serial('id').primaryKey(),
  orgId: varchar('org_id', { length: 255 }).notNull(),
  allowedMethods: jsonb('allowed_methods').$type<string[]>().default(['card']),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userDialerMap = pgTable('user_dialer_map', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => publicUsers.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 50 }).notNull(),
  externalAgentId: varchar('external_agent_id', { length: 255 }).notNull(),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  actorUserId: integer('actor_user_id').notNull().references(() => publicUsers.id),
  targetUserId: integer('target_user_id').references(() => publicUsers.id),
  targetOrgId: varchar('target_org_id', { length: 255 }),
  action: varchar('action', { length: 100 }).notNull(),
  before: jsonb('before'),
  after: jsonb('after'),
  ip: varchar('ip', { length: 45 }),
  userAgent: varchar('user_agent', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  orgId: varchar('org_id', { length: 255 }),
  userId: integer('user_id').references(() => publicUsers.id, { onDelete: 'cascade' }),
  keyHash: varchar('key_hash', { length: 255 }).notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  scopes: jsonb('scopes').$type<string[]>().default([]),
  ipAllowlist: jsonb('ip_allowlist').$type<string[]>(),
  rateLimitPerMin: integer('rate_limit_per_min'),
  createdBy: integer('created_by').notNull().references(() => publicUsers.id),
  lastUsedAt: timestamp('last_used_at'),
  revokedAt: timestamp('revoked_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).unique().notNull(),
  description: varchar('description', { length: 255 }),
  discountType: varchar('discount_type', { length: 20 }).notNull(), // 'percentage' or 'fixed'
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  maxUses: integer('max_uses'),
  currentUses: integer('current_uses').default(0),
  validFrom: timestamp('valid_from'),
  validUntil: timestamp('valid_until'),
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').notNull().references(() => publicUsers.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const couponRedemptions = pgTable('coupon_redemptions', {
  id: serial('id').primaryKey(),
  couponId: integer('coupon_id').notNull().references(() => coupons.id),
  userId: integer('user_id').notNull().references(() => publicUsers.id),
  orderId: integer('order_id').references(() => orders.id),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const callsCache = pgTable('calls_cache', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => publicUsers.id, { onDelete: 'cascade' }),
  period: varchar('period', { length: 10 }).notNull(), // 'today', '7d', '30d'
  callsCount: integer('calls_count').default(0),
  avgHandleTime: integer('avg_handle_time'), // seconds
  occupancy: decimal('occupancy', { precision: 5, scale: 2 }), // percentage
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Add role column to publicUsers
export const publicUsersWithRole = pgTable('public_users', {
  ...publicUsers,
  role: varchar('role', { length: 50 }).default('customer'),
  permissions: jsonb('permissions').$type<string[]>().default([]),
  orgId: varchar('org_id', { length: 255 }),
  isMfaEnabled: boolean('is_mfa_enabled').default(false),
  lastLoginAt: timestamp('last_login_at'),
  status: varchar('status', { length: 20 }).default('active'), // active, suspended, locked
});

// Types
export type UserFeatureFlag = typeof userFeatureFlags.$inferSelect;
export type InsertUserFeatureFlag = typeof userFeatureFlags.$inferInsert;
export type UserIntegrationPolicy = typeof userIntegrationPolicies.$inferSelect;
export type InsertUserIntegrationPolicy = typeof userIntegrationPolicies.$inferInsert;
export type OrgIntegrationPolicy = typeof orgIntegrationPolicies.$inferSelect;
export type InsertOrgIntegrationPolicy = typeof orgIntegrationPolicies.$inferInsert;
export type UserPaymentPolicy = typeof userPaymentPolicies.$inferSelect;
export type InsertUserPaymentPolicy = typeof userPaymentPolicies.$inferInsert;
export type OrgPaymentPolicy = typeof orgPaymentPolicies.$inferSelect;
export type InsertOrgPaymentPolicy = typeof orgPaymentPolicies.$inferInsert;
export type UserDialerMap = typeof userDialerMap.$inferSelect;
export type InsertUserDialerMap = typeof userDialerMap.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;
export type CouponRedemption = typeof couponRedemptions.$inferSelect;
export type InsertCouponRedemption = typeof couponRedemptions.$inferInsert;
export type CallsCache = typeof callsCache.$inferSelect;
export type InsertCallsCache = typeof callsCache.$inferInsert;
export type User = typeof publicUsers.$inferSelect;
export type UserWithPrivileges = User & { privileges: string[] };