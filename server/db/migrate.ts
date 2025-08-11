
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  console.log("🔄 Running database migrations...");
  
  try {
    await migrate(db, { migrationsFolder: "./server/db/migrations" });
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await migrationClient.end();
  }
};

if (require.main === module) {
  runMigrations().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { runMigrations };
