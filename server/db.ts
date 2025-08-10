
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export async function healthCheck() {
  try {
    await sql`SELECT 1`;
    return { db: true };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { db: false };
  }
}

export default db;
