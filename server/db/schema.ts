
import { pgTable, varchar, integer, boolean, timestamp, jsonb, primaryKey } from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  timezone: varchar("timezone", { length: 64 }).default("America/New_York").notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 80 }),
  planId: varchar("plan_id", { length: 16 }).notNull(), // 'starter' | 'growth' | 'scale'
  createdAt: timestamp("created_at").defaultNow()
});

export const features = pgTable("features", {
  id: varchar("id", { length: 64 }).primaryKey(),      // e.g. 'live_chat'
  label: varchar("label", { length: 120 }).notNull(),
  description: varchar("description", { length: 400 })
});

export const plans = pgTable("plans", {
  id: varchar("id", { length: 16 }).primaryKey(),      // 'starter'|'growth'|'scale'
  stripePriceId: varchar("stripe_price_id", { length: 80 }), // null → "Get a quote"
  agentSeats: integer("agent_seats").default(1),
  hoursPreset: varchar("hours_preset", { length: 16 }).notNull() // 'business'|'extended'|'24x7'
});

export const planFeatures = pgTable("plan_features", {
  planId: varchar("plan_id", { length: 16 }).notNull(),
  featureId: varchar("feature_id", { length: 64 }).notNull(),
}, (t) => ({ pk: primaryKey({ columns: [t.planId, t.featureId] }) }));

export const entitlements = pgTable("entitlements", {
  orgId: varchar("org_id", { length: 36 }).notNull(),
  featureId: varchar("feature_id", { length: 64 }).notNull(),
  value: jsonb("value"),
  enabled: boolean("enabled").default(true)
}, (t) => ({ pk: primaryKey({ columns: [t.orgId, t.featureId] }) }));
