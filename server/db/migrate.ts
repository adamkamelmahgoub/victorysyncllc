
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool } from "@neondatabase/serverless";
import { seedDatabase } from "./seedData";

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  console.log("🔄 Running migrations...");
  await migrate(db, { migrationsFolder: "./migrations" });
  console.log("✅ Migrations completed");

  console.log("Starting database seeding...");
  await seedDatabase();
  console.log("Seeding completed!");

  await pool.end();
}

// Check if this file is being run directly (ES module compatible)
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });
}

export { runMigrations };
