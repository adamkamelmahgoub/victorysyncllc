
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

// Create postgres connection
const sql = postgres(DATABASE_URL, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(sql, { schema });

// Health check function
export async function healthCheck(): Promise<{ ok: boolean; db: boolean }> {
  try {
    await sql`SELECT 1`;
    return { ok: true, db: true };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { ok: false, db: false };
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await sql.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await sql.end();
  process.exit(0);
});
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = neon(connectionString);
export const db = drizzle(sql);

export async function healthCheck() {
  try {
    await sql`SELECT 1`;
    return { db: true };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { db: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
