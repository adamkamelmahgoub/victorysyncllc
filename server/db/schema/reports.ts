
import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core"

export const scheduledReports = pgTable("scheduled_reports", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  schedule: text("schedule").notNull(),
  recipients: jsonb("recipients").notNull(),
  config: jsonb("config"),
  active: boolean("active").notNull().default(true),
  lastRunAt: timestamp("last_run_at"),
  nextRunAt: timestamp("next_run_at"),
  createdAt: timestamp("created_at").notNull().defaultNow()
})
