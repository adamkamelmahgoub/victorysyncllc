
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { db } from '../db';
import { sql } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Read and execute migrations
    const migrations = [
      '000_create_base_tables.sql',
      '001_create_integrations_table.sql',
      '002_create_features_table.sql',
      '003_create_team_members_table.sql'
    ];
    
    for (const migration of migrations) {
      console.log(`Running migration: ${migration}`);
      const migrationPath = join(__dirname, migration);
      const migrationSQL = readFileSync(migrationPath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          await db.execute(sql.raw(statement));
        }
      }
    }
    
    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}
