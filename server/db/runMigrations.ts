// ESM-safe __dirname shim
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { readFileSync, readdirSync } from 'fs';
import { query } from './index';

async function run() {
  await query`CREATE TABLE IF NOT EXISTS _migrations (id text primary key, ran_at timestamptz default now());`;
  const migrationsDir = resolve(__dirname, 'migrations');
  const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  const ran = await query<{id:string}>`SELECT id FROM _migrations`;
  const ranSet = new Set(ran.map(r => r.id));

  for (const f of files) {
    if (ranSet.has(f)) continue;
    const ddl = readFileSync(join(migrationsDir, f), 'utf8');
    await query`${ddl}` as any;
    await query`INSERT INTO _migrations (id) VALUES (${f});`;
    console.log('Applied', f);
  }
  console.log('All migrations up to date.');
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});