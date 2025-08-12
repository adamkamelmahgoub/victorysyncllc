
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

export async function runMigrations() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    // Create migrations table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Get migration files
    const migrationsDir = path.join(process.cwd(), 'server/db/migrations');
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
    }
    
    const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    
    for (const filename of migrationFiles) {
      // Check if migration already executed
      const executed = await sql`SELECT id FROM migrations WHERE filename = ${filename}`;
      
      if (executed.length === 0) {
        console.log(`Running migration: ${filename}`);
        const migrationSQL = fs.readFileSync(path.join(migrationsDir, filename), 'utf8');
        
        // Execute migration
        await sql.transaction(async (tx) => {
          await tx.unsafe(migrationSQL);
          await tx`INSERT INTO migrations (filename) VALUES (${filename})`;
        });
        
        console.log(`✅ Migration completed: ${filename}`);
      }
    }
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}
