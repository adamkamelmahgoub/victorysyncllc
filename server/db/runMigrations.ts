import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readdirSync, readFileSync } from 'node:fs';
import { sql } from './index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MIGRATIONS_DIR = join(__dirname, 'migrations');

async function ensureMigrationsTable() {
  await sql`
    create table if not exists schema_migrations (
      id serial primary key,
      name text not null unique,
      applied_at timestamptz not null default now()
    )
  `;
}

async function getApplied(): Promise<Set<string>> {
  const rows = await sql`select name from schema_migrations order by applied_at asc`;
  return new Set(rows.map((r: any) => r.name));
}

export async function runMigrations() {
  await ensureMigrationsTable();
  const applied = await getApplied();
  const files = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const full = join(MIGRATIONS_DIR, file);
    const sqlText = readFileSync(full, 'utf8');
    console.log('Applying migration:', file);
    await sql(sqlText as any);
    await sql`insert into schema_migrations (name) values (${file})`;
  }

  console.log('✅ All migrations applied');
}

// Allow running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  });
}