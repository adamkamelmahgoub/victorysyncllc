import { readFileSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { nullFactEffects, siteFacts } from '../client/src/config/siteFacts';
import { PAGES } from '../pages.js';

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

const prohibited = ['24/7', '24 hours a day', '60% savings', 'up to 60%', '40–60%', '40-60%', 'money-back', 'self-learning', 'WFM/WFO', 'TBD'];
const files = htmlFiles(builtDir);
const failures: string[] = [];
const suppliedSeoPages = new Set(PAGES.map((page) => `/${page.slug}`));
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  const route = '/' + relative(builtDir, file).replace(/\\/g, '/').replace(/(^|\/)index\.html$/, '').replace(/\/$/, '');
  for (const phrase of prohibited) {
    // These pages use the supplied copy verbatim; the claim audit applies to site-authored copy.
    if (phrase === '24/7' && suppliedSeoPages.has(route)) continue;
    if (html.toLowerCase().includes(phrase.toLowerCase())) failures.push(`${file}: ${phrase}`);
  }
  // Check the placeholder syntax so normal legal wording such as "to confirm" is allowed.
  if (/\[TO CONFIRM(?:\]|:)/i.test(html)) failures.push(`${file}: [TO CONFIRM] placeholder`);
  if (/href=["']#["']/i.test(main)) failures.push(`${file}: href="#" in main content`);
  const types: string[] = [];
  for (const match of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1]);
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      for (const entry of entries) {
        if (entry?.['@type']) types.push(String(entry['@type']));
      }
    } catch (error) {
      failures.push(`${file}: invalid JSON-LD, ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (types.some((type) => type === 'Review' || type === 'AggregateRating')) failures.push(`${file}: prohibited review schema`);
  console.log(`JSON-LD ${route}: ${types.length ? types.join(', ') : '(none)'}`);
}

if (failures.length) {
  console.error('FACT CHECK FAILED:');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log(`Fact check passed for ${files.length} built HTML files.`);
