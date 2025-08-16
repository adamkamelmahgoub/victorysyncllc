
import { db } from "../db";
import { packages } from "../../shared/schema";
import { eq } from "drizzle-orm";

type InsertPackage = {
  name: string;
  price: string;
  description?: string;
  features: string[];
};

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

// Guard against accidental strings/null
function ensureArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (v === null || v === undefined) return [];
  return [String(v)];
}

export async function seedDefaultPackages() {
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
