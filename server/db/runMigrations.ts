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
    
    // Handle complex SQL with DO blocks and multiple statements
    const lines = sqlText.split('\n');
    let currentStatement = '';
    let inDoBlock = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('--')) {
        continue;
      }
      
      // Check for DO block start
      if (trimmedLine.startsWith('DO $$') || trimmedLine === 'DO $$') {
        inDoBlock = true;
        currentStatement += line + '\n';
        continue;
      }
      
      // Check for DO block end
      if (inDoBlock && (trimmedLine === 'END $$;' || trimmedLine.startsWith('END $$'))) {
        currentStatement += line + '\n';
        inDoBlock = false;
        
        // Execute the complete DO block
        if (currentStatement.trim()) {
          await sql(currentStatement.trim() as any);
        }
        currentStatement = '';
        continue;
      }
      
      // If we're in a DO block, keep adding lines
      if (inDoBlock) {
        currentStatement += line + '\n';
        continue;
      }
      
      // For regular statements, add the line
      currentStatement += line + '\n';
      
      // If line ends with semicolon, execute the statement
      if (trimmedLine.endsWith(';')) {
        const statement = currentStatement.trim();
        if (statement && !statement.startsWith('--')) {
          await sql(statement as any);
        }
        currentStatement = '';
      }
    }
    
    // Execute any remaining statement
    if (currentStatement.trim() && !currentStatement.trim().startsWith('--')) {
      await sql(currentStatement.trim() as any);
    }
    
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