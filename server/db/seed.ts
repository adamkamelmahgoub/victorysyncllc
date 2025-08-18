import fs from "node:fs/promises";
import path from "node:path";

import { db } from "../db";
import { packages, users, organizations, roles, permissions, rolePermissions } from "./schema";
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

// If you already have Drizzle or a proper seed system, call into it here instead.
// This file provides an idempotent, minimal "seed once" that you can expand.

const lockFile = path.join(process.cwd(), ".seeded.lock");

// Guard against accidental strings/null
function ensureArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (v === null || v === undefined) return [];
  return [String(v)];
}

async function seedDefaultPackages() {
  const DEFAULT_PACKAGES: InsertPackage[] = [
    {
      name: "Starter",
      price: "1200.00",
      description: "Perfect for small businesses",
      features: [
        "1 Dedicated Agent",
        "Business Hours Support",
        "Basic CRM Integration",
        "Email Support",
        "Monthly Reports"
      ],
    },
    {
      name: "Growth",
      price: "2500.00",
      description: "For growing companies",
      features: [
        "2 Dedicated Agents",
        "Extended Hours Support",
        "Appointment Setting",
        "Advanced CRM Integration",
        "Live Chat Support",
        "Weekly Reports"
      ],
    },
    {
      name: "Scale",
      price: "4500.00",
      description: "For enterprise needs",
      features: [
        "24/7 Blended Team",
        "AI Automation Suite",
        "Dedicated Success Manager",
        "Custom Integrations",
        "Priority Support",
        "Real-time Analytics"
      ],
    },
  ];

  console.log('Creating default packages...');

  for (const pkg of DEFAULT_PACKAGES) {
    try {
      const existing = await db.select().from(packages).where(eq(packages.name, pkg.name));

      if (existing.length === 0) {
        await db.insert(packages)
          .values({
            name: pkg.name,
            price: pkg.price,
            description: pkg.description,
            features: ensureArray(pkg.features),
          });
        console.log(`✅ Created package: ${pkg.name}`);
      } else {
        console.log(`📦 Package already exists: ${pkg.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating package ${pkg.name}:`, error);
    }
  }
}

async function seedData() {
  try {
    // Create default organization
    const defaultOrg = await db.select().from(organizations).where(eq(organizations.id, 1)).limit(1)
    if (!defaultOrg.length) {
      await db.insert(organizations).values({
        id: 1,
        name: "VictorySync",
        active: true
      })
    }

    // Create roles
    const adminRole = await db.select().from(roles).where(eq(roles.name, "admin")).limit(1)
    if (!adminRole.length) {
      await db.insert(roles).values([
        { name: "superAdmin", description: "Super Administrator" },
        { name: "admin", description: "Administrator" },
        { name: "user", description: "Regular User" }
      ])
    }

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@victorysync.com"
    const adminPassword = process.env.ADMIN_PASSWORD || "victorysync2025"

    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1)
    if (!existingAdmin.length) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      await db.insert(users).values({
        email: adminEmail,
        username: process.env.ADMIN_USERNAME || "admin",
        name: "System Administrator",
        password: hashedPassword,
        role: "admin",
        orgId: 1,
        emailVerified: true,
        phoneVerified: true,
        active: true
      })
      console.log(`✅ Admin user created: ${adminEmail} / ${adminPassword}`)
    }

    // Create default packages (from original seedData function)
    const existingPackages = await db.select().from(packages).limit(1)
    if (!existingPackages.length) {
      await db.insert(packages).values([
        {
          name: "Starter",
          pricePerSeat: "99.00",
          features: JSON.stringify([
            "24/7 Customer Support",
            "Basic Call Center Services",
            "Email Support",
            "Up to 5 agents"
          ]),
          active: true
        },
        {
          name: "Growth",
          pricePerSeat: "199.00",
          features: JSON.stringify([
            "Everything in Starter",
            "AI Chat Automation",
            "Advanced Analytics",
            "Up to 25 agents",
            "Phone Support"
          ]),
          active: true
        },
        {
          name: "Scale",
          pricePerSeat: "399.00",
          features: JSON.stringify([
            "Everything in Growth",
            "Custom Integrations",
            "Dedicated Account Manager",
            "Unlimited agents",
            "SLA Guarantees"
          ]),
          active: true
        }
      ])
      console.log("✅ Default packages created")
    }

    console.log("✅ Database seeded successfully")
  } catch (error) {
    console.error("❌ Database seeding failed:", error)
  }
}


export async function seedOnce() {
  try {
    await fs.access(lockFile);
    // lock exists => already seeded
    return;
  } catch {
    // proceed
  }

  // TODO: replace with your real seed (roles, super admin, packages…)
  // This keeps your previous logic but ensures it won't throw when re-run.
  console.info("Seeding baseline roles, permissions, superAdmin…");
  await seedDefaultPackages(); // Call the original package seeding logic
  await seedData(); // Call the original general seeding logic

  await fs.writeFile(lockFile, new Date().toISOString(), "utf8");
  console.info("Seed complete (lock created).");
}

type InsertPackage = {
  name: string;
  price: string;
  description?: string;
  features: string[];
};