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

export const integrations = pgTable('integrations', {
  id: serial('id').primaryKey(),
  customer_id: text('customer_id').notNull(),
  type: text('type').notNull(), // 'hubspot', 'salesforce', 'five9', etc.
  access_token: text('access_token').notNull(),
  refresh_token: text('refresh_token'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Features table for feature flags
export const featuresEnabled = pgTable('features_enabled', {
  id: serial('id').primaryKey(),
  customer_id: integer('customer_id').notNull().references(() => publicUsers.id, { onDelete: 'cascade' }),
  feature_key: varchar('feature_key', { length: 100 }).notNull(),
  enabled: boolean('enabled').default(false),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => ({
  uniqueCustomerFeature: index('unique_customer_feature').on(table.customer_id, table.feature_key),
  customerIdIdx: index('idx_features_customer_id').on(table.customer_id),
  featureKeyIdx: index('idx_features_feature_key').on(table.feature_key),
}));

// Team members table for seat-based billing
export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  customer_id: integer('customer_id').notNull().references(() => publicUsers.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('member').notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  invited_at: timestamp('invited_at').defaultNow(),
  accepted_at: timestamp('accepted_at'),
  stripe_subscription_item_id: varchar('stripe_subscription_item_id', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => ({
  uniqueCustomerEmail: index('unique_customer_email').on(table.customer_id, table.email),
  customerIdIdx: index('idx_team_members_customer_id').on(table.customer_id),
  emailIdx: index('idx_team_members_email').on(table.email),
  statusIdx: index('idx_team_members_status').on(table.status),
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