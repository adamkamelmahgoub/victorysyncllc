
import fs from 'fs';
import path from 'path';
import sql from './index';

const MIGRATIONS_DIR = path.join(process.cwd(), 'server', 'db', 'migrations');

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

async function applied(): Promise<Set<string>> {
  const rows = await sql`SELECT name FROM schema_migrations`;
  return new Set(rows.map((r: any) => r.name));
}

async function applyMigration(name: string, sqlText: string) {
  await sql`BEGIN`;
  try {
    // Execute the entire SQL text as one command to handle complex statements properly
    await sql.unsafe(sqlText);
    
    await sql`INSERT INTO schema_migrations (name) VALUES (${name})`;
    await sql`COMMIT`;
    console.log(`✅ Applied ${name}`);
  } catch (err) {
    await sql`ROLLBACK`;
    console.error(`❌ Failed ${name}`, err);
    process.exit(1);
  }
}

async function main() {
  await ensureTable();
  const done = await applied();
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();
  for (const f of files) {
    if (!done.has(f)) {
      const text = fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf8');
      await applyMigration(f, text);
    }
  }
  console.log('🎉 Migrations complete');
}

export async function runMigrations() {
  return await main();
}

// Only run main() if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
