
import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core"

export const invites = pgTable("invites", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  orgId: integer("org_id").notNull(),
  roleId: integer("role_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow()
})

export const accessCodes = pgTable("access_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  email: text("email"),
  phone: text("phone"),
  name: text("name"),
  organizationNumber: text("organization_number"),
  roleId: integer("role_id").notNull(),
  usesRemaining: integer("uses_remaining").notNull().default(1),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  revokedAt: timestamp("revoked_at")
})

export const otps = pgTable("otps", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull(),
  purpose: text("purpose").notNull(),
  codeHash: text("code_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow()
})
