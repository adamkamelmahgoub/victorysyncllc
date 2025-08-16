import { db } from "../db";
import { servicePackagesTable, servicesTable } from "./schema";

export async function seedDatabase() {
  console.log("Seeding database with VictorySync packages...");

  // Seed services
  const services = [
    {
      name: "Digital Marketing",
      description: "Complete digital marketing solutions",
      category: "marketing",
    },
    {
      name: "Website Development", 
      description: "Custom website and web application development",
      category: "development",
    },
    {
      name: "SEO Optimization",
      description: "Search engine optimization services",
      category: "marketing",
    },
    {
      name: "Business Consulting",
      description: "Strategic business consulting and planning",
      category: "consulting",
    },
  ];

  await db.insert(servicesTable).values(services).onConflictDoNothing();

  // Seed service packages
  const packages = [
    {
      name: "Starter Package",
      description: "Perfect for small businesses getting started with digital marketing",
      price: 49900, // $499.00
      duration: 1,
      features: {
        "dedicated_agent": true,
        "24_7_support": true,
        "basic_analytics": true,
      },
    },
    {
      name: "Growth Package",
      description: "Accelerate your business growth with comprehensive marketing",
      price: 99900, // $999.00
      duration: 3,
      features: {
        "dedicated_agents_3": true,
        "24_7_support": true,
        "advanced_analytics": true,
        "crm_integration": true
      },
    },
    {
      name: "Enterprise Package",
      description: "Full-scale digital transformation for established businesses",
      price: 249900, // $2,499.00
      duration: 6,
      features: {
        "dedicated_agents_5": true,
        "24_7_support": true,
        "premium_analytics": true,
        "crm_integration": true,
        "ai_automation": true,
        "custom_workflows": true
      },
    },
    {
      name: "Custom Consulting",
      description: "Tailored consulting services for unique business needs",
      price: 19900, // $199.00
      duration: null,
      features: {
        "dedicated_agent": true,
        "24_7_support": true,
        "basic_analytics": true,
      },
    },
  ];

  await db.insert(servicePackagesTable).values(packages).onConflictDoNothing();

  console.log("Database seeded successfully!");
}