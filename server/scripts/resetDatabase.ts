
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const sqlClient = neon(connectionString);
const db = drizzle(sqlClient);

async function resetDatabase() {
  console.log('🔄 Resetting database...');
  
  try {
    // Drop all tables to start fresh
    await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
    await db.execute(sql`CREATE SCHEMA public`);
    
    console.log('✅ Database reset complete');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  resetDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
