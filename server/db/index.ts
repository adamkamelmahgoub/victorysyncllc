
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const DATABASE_URL = process.env.DATABASE_URL!;
if (!DATABASE_URL) throw new Error('DATABASE_URL is missing');

export const sql = neon(DATABASE_URL, { fetchConnectionCache: true });
export const db = drizzle(sql);

// Export query function for direct SQL queries
export const query = sql;
