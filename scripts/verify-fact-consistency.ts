import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { siteFacts } from '../client/src/config/siteFacts';

const out = resolve(import.meta.dirname, '..', 'dist', 'public');
const targets = [
  ['Home', resolve(out, 'index.html')],
  ['Contact', resolve(out, 'contact', 'index.html')],
  ['Help Center', resolve(out, 'help-center', 'index.html')],
  ['llms.txt', resolve(out, 'llms.txt')],
] as const;
const facts = [
  ['hours', siteFacts.hours],
  ['phone', siteFacts.phoneUS],
  ['address', siteFacts.address],
] as const;

for (const [label, file] of targets) {
  const content = readFileSync(file, 'utf8');
  for (const [fact, expected] of facts) {
    if (!content.includes(expected)) throw new Error(`${label} does not contain the canonical ${fact}: ${expected}`);
  }
  console.log(`${label}: canonical hours, phone, and address match siteFacts`);
}

for (const page of ['index.html', 'contact/index.html']) {
  const html = readFileSync(resolve(out, page), 'utf8');
  const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const data = blocks.flatMap((match) => {
    const parsed = JSON.parse(match[1]);
    return Array.isArray(parsed) ? parsed : [parsed];
  });
  const business = data.find((entry) => entry['@type'] === 'ProfessionalService');
  if (!business || business.telephone !== siteFacts.phoneUS || business.openingHours !== siteFacts.hours) throw new Error(`${page}: schema phone or hours differ from siteFacts`);
  const schemaAddress = [business.address?.streetAddress, business.address?.addressLocality, `${business.address?.addressRegion} ${business.address?.postalCode}`].join(', ');
  if (schemaAddress !== siteFacts.address) throw new Error(`${page}: schema address differs from siteFacts`);
  console.log(`${page}: ProfessionalService schema phone and address match siteFacts`);
}
