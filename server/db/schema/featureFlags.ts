
import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core"

export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  defaultEnabled: boolean("default_enabled").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
})

export const orgFeatureFlags = pgTable("org_feature_flags", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  featureId: integer("feature_id").notNull().references(() => features.id),
  enabled: boolean("enabled").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
})

export const userFeatureFlags = pgTable("user_feature_flags", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  featureId: integer("feature_id").notNull().references(() => features.id),
  enabled: boolean("enabled").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
})
