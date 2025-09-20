
import { neon, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";

neonConfig.webSocketConstructor = WebSocket;
neonConfig.fetchConnectionCache = true;

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set in Replit Secrets");
  process.exit(1);
}

const sql = neon(url);

async function main() {
  try {
    console.log("🔧 Fixing users table schema...");
    
    // Add role column if it doesn't exist
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role varchar(32)`;
    
    // Set default value for role column
    await sql`ALTER TABLE users ALTER COLUMN role SET DEFAULT 'member'`;
    
    // Backfill existing users with 'member' role
    await sql`UPDATE users SET role = 'member' WHERE role IS NULL`;
    
    // Make role column NOT NULL
    await sql`ALTER TABLE users ALTER COLUMN role SET NOT NULL`;
    
    // Create unique index on email if it doesn't exist
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users (email)`;
    
    // Optional: mark the demo user
    await sql`UPDATE users SET role = 'demo' WHERE email = 'demo@victorysync.com'`;
    
    console.log("✅ users.role added/backfilled and email unique index ensured");
  } catch (error) {
    console.error("❌ fix_role_column failed:", error?.message || error);
    process.exit(1);
  }
}

main().catch(e => {
  console.error("❌ fix_role_column failed:", e?.message || e);
  process.exit(1);
});
