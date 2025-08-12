// server/db/runMigrations.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sql } from './index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  try {
    console.log('Starting migrations...');
    const dir = path.join(__dirname, 'migrations');
    
    if (!fs.existsSync(dir)) {
      console.log('Migrations directory not found, creating...');
      fs.mkdirSync(dir, { recursive: true });
      console.log('No migrations to run.');
      return;
    }
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
    console.log(`Found ${files.length} migration files`);
    
    await sql`CREATE TABLE IF NOT EXISTS _migrations (id text primary key, ran_at timestamptz default now());`;
    const ran = await sql`SELECT id FROM _migrations`;
    const ranSet = new Set(ran.map((r: any) => r.id));

    for (const f of files) {
      if (ranSet.has(f)) {
        console.log(`Skipping ${f} (already applied)`);
        continue;
      }
      
      console.log(`Applying migration: ${f}`);
      const ddl = fs.readFileSync(path.join(dir, f), 'utf8');
      
      // Split SQL file by semicolons and execute each statement separately
      const statements = ddl.split(';').filter(stmt => stmt.trim().length > 0);
      
      for (const statement of statements) {
        if (statement.trim()) {
          await sql.unsafe(statement + ';');
        }
      }
      
      await sql`INSERT INTO _migrations (id) VALUES (${f});`;
      console.log(`✅ Applied ${f}`);
    }
    
    console.log('All migrations up to date.');
    await sql.end();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

run().catch(e => { 
  console.error('Migration error:', e); 
  process.exit(1); 
});