
import fs from 'fs';
import path from 'path';
import { sql } from './index';

async function run() {
  await sql`CREATE TABLE IF NOT EXISTS _migrations (id text primary key, ran_at timestamptz default now());`;
  const dir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  const ran = await sql<{id:string}>`SELECT id FROM _migrations`;
  const ranSet = new Set(ran.map(r => r.id));
  
  for (const f of files) {
    if (ranSet.has(f)) continue;
    const ddl = fs.readFileSync(path.join(dir, f), 'utf8');
    await sql`${ddl}` as any;
    await sql`INSERT INTO _migrations (id) VALUES (${f});`;
    console.log('Applied', f);
  }
  console.log('All migrations up to date.');
}

run().catch(e => { 
  console.error(e); 
  process.exit(1); 
});
