
import { neon, neonConfig } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

neonConfig.fetchConnectionCache = true;
export const sql = neon(process.env.DATABASE_URL);
export default sql;

export async function dbHealthcheck() {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    throw error;
  }
}
