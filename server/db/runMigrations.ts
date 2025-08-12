
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
    // Parse SQL text into statements, handling DO blocks properly
    const statements = [];
    let current = '';
    let inDoBlock = false;
    
    const lines = sqlText.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip comments and empty lines
      if (!trimmedLine || trimmedLine.startsWith('--')) continue;
      
      current += line + '\n';
      
      // Check for DO block start
      if (trimmedLine.match(/^DO\s+\$\$/i)) {
        inDoBlock = true;
      }
      
      // Check for DO block end
      if (inDoBlock && trimmedLine.match(/^END\s+\$\$;?$/i)) {
        inDoBlock = false;
        statements.push(current.trim());
        current = '';
      }
      // Check for regular statement end (semicolon at end of line, not in DO block)
      else if (!inDoBlock && trimmedLine.endsWith(';')) {
        statements.push(current.trim());
        current = '';
      }
    }
    
    // Add any remaining content
    if (current.trim()) {
      statements.push(current.trim());
    }
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await sql([statement] as any);
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
