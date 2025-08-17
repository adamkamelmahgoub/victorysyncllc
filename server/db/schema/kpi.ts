
import { pgTable, serial, date, integer, decimal, timestamp } from "drizzle-orm/pg-core"

export const kpiDaily = pgTable("kpi_daily", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  orgId: integer("org_id").notNull(),
  totalCalls: integer("total_calls").notNull().default(0),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).notNull().default("0"),
  activeUsers: integer("active_users").notNull().default(0),
  avgResponseTime: decimal("avg_response_time", { precision: 8, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow()
})
