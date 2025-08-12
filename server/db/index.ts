
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const sql = neon(url);

// quick health check helper
export async function dbHealthcheck() {
  await sql`select 1 as ok`;
}
