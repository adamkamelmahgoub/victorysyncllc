
import { fileURLToPath } from 'url';
import path from 'path';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { db } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsFolder = path.resolve(__dirname, './migrations');

(async () => {
  await migrate(db, { migrationsFolder });
  console.log('✅ Migrations applied successfully');
  process.exit(0);
})();
