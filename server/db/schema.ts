import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  serial,
  varchar,
  jsonb,
  uniqueIndex,
  numeric,
} from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  idCode: varchar("id_code", { length: 40 }).notNull(), // org "ID code"
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({ idCodeIdx: uniqueIndex("org_id_code_idx").on(t.idCode) }));

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 190 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  orgId: integer("org_id").references(() => organizations.id),
  role: varchar("role", { length: 24 }).notNull(), // superAdmin | admin | manager | agent | customer
  permissions: jsonb("permissions").$type<string[]>().default([]).notNull(),
  mfaEnabled: boolean("mfa_enabled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => ({ emailIdx: uniqueIndex("users_email_idx").on(t.email) }));

export const mfaBackupCodes = pgTable("mfa_backup_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  codeHash: varchar("code_hash", { length: 190 }).notNull(),
  usedAt: timestamp("used_at")
});

export const invites = pgTable("invites", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id).notNull(),
  email: varchar("email", { length: 190 }).notNull(),
  role: varchar("role", { length: 24 }).notNull(),
  token: varchar("token", { length: 120 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at")
}, (t)=>({ tokenIdx: uniqueIndex("invites_token_idx").on(t.token) }));

export const accessCodes = pgTable("access_codes", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id).notNull(),
  code: varchar("code", { length: 120 }).notNull(),
  role: varchar("role", { length: 24 }).notNull(),
  maxUses: integer("max_uses").notNull(),
  usedCount: integer("used_count").default(0).notNull(),
  expiresAt: timestamp("expires_at"),
  createdBy: integer("created_by").references(() => users.id),
  fullName: varchar("full_name", { length: 160 }),
  email: varchar("email", { length: 190 }),
  phone: varchar("phone", { length: 40 }),
  orgName: varchar("org_name", { length: 160 }),
  orgIdCode: varchar("org_id_code", { length: 40 })
}, (t)=>({ codeIdx: uniqueIndex("access_codes_code_idx").on(t.code) }));

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(()=>organizations.id).notNull(),
  keyHash: varchar("key_hash", { length: 190 }).notNull(),
  label: varchar("label", { length: 190 }).notNull(),
  scopes: jsonb("scopes").$type<string[]>().default([]).notNull(),
  createdBy: integer("created_by").references(()=>users.id),
  lastUsedAt: timestamp("last_used_at"),
  revoked: boolean("revoked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(()=>organizations.id).notNull(),
  url: text("url").notNull(),
  secret: varchar("secret", { length: 120 }).notNull(),
  events: jsonb("events").$type<string[]>().default([]).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const webhookFailures = pgTable("webhook_failures", {
  id: serial("id").primaryKey(),
  webhookId: integer("webhook_id").references(()=>webhooks.id).notNull(),
  payload: jsonb("payload").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 160 }).notNull(),
  lastName: varchar("last_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 190 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  seats: integer("seats").default(1).notNull()
}, (t)=>({ slugIdx: uniqueIndex("packages_slug_idx").on(t.slug) }));

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(()=>organizations.id).notNull(),
  userId: integer("user_id").references(()=>users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 16 }).notNull(), // pending|processing|completed|cancelled|refunded
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(()=>orders.id).notNull(),
  sku: varchar("sku", { length: 120 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  quantity: integer("quantity").notNull(),
  priceAtTime: numeric("price_at_time", { precision: 10, scale: 2 }).notNull()
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 80 }).notNull(),
  type: varchar("type", { length: 16 }).notNull(), // percent | fixed
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  appliesToPackageId: integer("applies_to_package_id").references(()=>packages.id),
  orgId: integer("org_id").references(()=>organizations.id),
  maxRedemptions: integer("max_redemptions"),
  redeemedCount: integer("redeemed_count").default(0).notNull(),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  isActive: boolean("is_active").default(true).notNull()
}, (t)=>({ codeIdx: uniqueIndex("coupons_code_idx").on(t.code) }));

export const redemptions = pgTable("redemptions", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id").references(()=>coupons.id).notNull(),
  orgId: integer("org_id").references(()=>organizations.id),
  userId: integer("user_id").references(()=>users.id),
  orderId: integer("order_id").references(()=>orders.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  redeemedAt: timestamp("redeemed_at").defaultNow().notNull()
});

export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(()=>organizations.id).notNull(),
  provider: varchar("provider", { length: 32 }).notNull(), // hubspot | twilio | ...
  status: varchar("status", { length: 16 }).default("disconnected").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(()=>users.id).notNull(),
  provider: varchar("provider", { length: 24 }).notNull(), // google|microsoft
  providerId: varchar("provider_id", { length: 190 }).notNull(),
  email: varchar("email", { length: 190 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (t)=>({ provIdx: uniqueIndex("social_provider_idx").on(t.provider, t.providerId) }));

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(()=>users.id),
  orgId: integer("org_id").references(()=>organizations.id),
  action: varchar("action", { length: 120 }).notNull(),
  meta: jsonb("meta"),
  ip: varchar("ip", { length: 64 }),
  ua: text("ua"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});