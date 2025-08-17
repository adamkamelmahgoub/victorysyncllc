
import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core"

export const orgSettings = pgTable("org_settings", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull().unique(),
  seatLimit: integer("seat_limit"),
  callQuotaMonthly: integer("call_quota_monthly"),
  dataRetentionDays: integer("data_retention_days").notNull().default(90),
  apiEnabled: boolean("api_enabled").notNull().default(false),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
})

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  orgId: integer("org_id"),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: text("resource_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow()
})
