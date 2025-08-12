
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { db } from './index.js';
import { sql } from 'drizzle-orm';

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Create migrations table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Get list of migration files
    const migrationsDir = join(process.cwd(), 'server/db/migrations');
    const files = await readdir(migrationsDir);
    const migrationFiles = files.filter(f => f.endsWith('.sql')).sort();

    // Get already executed migrations
    const executedMigrations = await db.execute(sql`
      SELECT filename FROM migrations ORDER BY executed_at
    `);
    
    const executedFilenames = new Set(
      executedMigrations.map((row: any) => row.filename)
    );

    // Run pending migrations
    for (const filename of migrationFiles) {
      if (!executedFilenames.has(filename)) {
        console.log(`📄 Running migration: ${filename}`);
        
        const migrationPath = join(migrationsDir, filename);
        const migrationSql = await readFile(migrationPath, 'utf8');
        
        // Execute migration
        await db.execute(sql.raw(migrationSql));
        
        // Record migration as executed
        await db.execute(sql`
          INSERT INTO migrations (filename) VALUES (${filename})
        `);
        
        console.log(`✅ Migration completed: ${filename}`);
      } else {
        console.log(`⏭️  Migration already executed: ${filename}`);
      }
    }

    console.log('✅ All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      console.log('Migration process completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
}

export { runMigrations };
