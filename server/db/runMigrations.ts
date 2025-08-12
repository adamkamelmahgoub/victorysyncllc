
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
    // Split SQL text into individual statements and execute them
    const statements = sqlText
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.match(/^\s*--/) && !stmt.match(/^\s*\/\*/)); // Remove empty, comment-only lines, and block comments
    
    // Execute each statement individually
    for (const statement of statements) {
      if (statement.trim()) {
        // For complex statements like DO blocks, we need to use a different approach
        try {
          await sql([statement] as any);
        } catch (err: any) {
          // If the statement fails, try executing it as a raw query
          console.log(`Retrying statement: ${statement.substring(0, 50)}...`);
          throw err;
        }
      }
    }
    
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
