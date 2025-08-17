
import { pgTable, serial, text, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core"

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  pricePerSeat: decimal("price_per_seat", { precision: 10, scale: 2 }).notNull(),
  features: text("features").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow()
})

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull().unique(),
  packageId: integer("package_id").notNull().references(() => packages.id),
  seats: integer("seats").notNull().default(1),
  status: text("status").notNull().default("active"),
  nextInvoiceDate: timestamp("next_invoice_date"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
})

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull(),
  subscriptionId: integer("subscription_id").notNull().references(() => subscriptions.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  stripeInvoiceId: text("stripe_invoice_id"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").notNull().defaultNow()
})

export const orgPaymentRules = pgTable("org_payment_rules", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").notNull().unique(),
  allowCard: boolean("allow_card").notNull().default(true),
  allowACH: boolean("allow_ach").notNull().default(false),
  allowInvoice: boolean("allow_invoice").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
})
