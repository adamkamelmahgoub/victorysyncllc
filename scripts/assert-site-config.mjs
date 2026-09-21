import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = resolve(import.meta.dirname, '..', 'client', 'src', 'lib', 'site-config.ts');
const config = readFileSync(file, 'utf8');
const placeholders = [...config.matchAll(/export const ([A-Z_]+) = '\[SUPPLY\]'/g)].map((match) => match[1]);
if (placeholders.length) throw new Error(`Site config is incomplete: ${placeholders.join(', ')}. Supply these values before building.`);
