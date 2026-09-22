import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { nullFactEffects, siteFacts } from '../client/src/config/siteFacts';

const builtDir = resolve(import.meta.dirname, '..', 'dist', 'public');

for (const [fact, effects] of Object.entries(nullFactEffects)) {
  if (siteFacts[fact as keyof typeof siteFacts] === null) {
    console.warn(`FACT WARNING: ${fact} is null`);
    for (const effect of effects) console.warn(`  - ${effect}`);
  }
}

function htmlFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? htmlFiles(path) : path.endsWith('.html') ? [path] : [];
  });
}

const prohibited = ['24/7', '24 hours a day', '60% savings', 'up to 60%', '40–60%', '40-60%', 'money-back', 'self-learning', 'WFM/WFO', 'TBD', 'TO CONFIRM'];
const files = htmlFiles(builtDir);
const failures: string[] = [];
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  for (const phrase of prohibited) {
    if (html.toLowerCase().includes(phrase.toLowerCase())) failures.push(`${file}: ${phrase}`);
  }
  if (/href=["']#["']/i.test(main)) failures.push(`${file}: href="#" in main content`);
}

if (failures.length) {
  console.error('FACT CHECK FAILED:');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log(`Fact check passed for ${files.length} built HTML files.`);
