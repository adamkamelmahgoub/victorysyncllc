
import { pool } from '../db';
import fs from 'fs';
import path from 'path';

export async function runMigrations() {
  try {
    // Ensure migrations table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS __migrations (
        filename VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migrationsDir = path.join(process.cwd(), 'migrations');
    
    // Check if migrations directory exists
    if (!fs.existsSync(migrationsDir)) {
      console.log('✅ No migrations directory found, skipping migrations');
      return;
    }

    // Get all SQL files
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('✅ No migration files found');
      return;
    }

    // Get already applied migrations
    const { rows: appliedMigrations } = await pool.query(
      'SELECT filename FROM __migrations'
    );
    const appliedSet = new Set(appliedMigrations.map((row: any) => row.filename));

    // Apply pending migrations
    for (const filename of migrationFiles) {
      if (appliedSet.has(filename)) {
        console.log(`⏭️  Skipping already applied migration: ${filename}`);
        continue;
      }

      console.log(`🔄 Applying migration: ${filename}`);
      
      const migrationPath = path.join(migrationsDir, filename);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

      // Execute migration in a transaction
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(migrationSQL);
        await client.query(
          'INSERT INTO __migrations (filename) VALUES ($1)',
          [filename]
        );
        await client.query('COMMIT');
        console.log(`✅ Applied migration: ${filename}`);
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Failed to apply migration ${filename}:`, error);
        throw error;
      } finally {
        client.release();
      }
    }

    console.log('✅ All migrations applied successfully');
  } catch (error) {
    console.error('❌ Migration runner failed:', error);
    throw error;
  }
}

// Allow running directly with tsx
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
