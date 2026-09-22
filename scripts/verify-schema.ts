import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { postalAddress, siteFacts, siteOrigin, starterPriceLabel } from '../client/src/config/siteFacts';

const out = resolve(import.meta.dirname, '..', 'dist', 'public');
const paths = [...readFileSync(join(out, 'sitemap.xml'), 'utf8')
  .matchAll(/<loc>https:\/\/www\.victorysync\.com([^<]*)<\/loc>/g)]
  .map((match) => match[1] || '/');
const servicePaths = new Set([
  '/appointment-setting', '/cold-calling', '/inbound-support', '/ai-automation', '/digital-marketing',
  '/appointment-setting-for-home-services', '/cold-calling-for-plumbers',
  '/answering-service-for-plumbers', '/appointment-setting-for-hvac',
  '/appointment-setting-for-real-estate', '/inbound-support-for-law-firms',
]);

for (const path of paths) {
  const html = readFileSync(join(out, path, 'index.html'), 'utf8');
  const data = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((match) => {
      const parsed = JSON.parse(match[1]);
      return Array.isArray(parsed) ? parsed : [parsed];
    });
  const types = data.map((item) => item['@type']);
  if (path !== '/' && !types.includes('BreadcrumbList')) throw new Error(`${path}: missing breadcrumb`);
  if (servicePaths.has(path) && !types.includes('Service')) throw new Error(`${path}: missing service`);
  if (['/', '/contact'].includes(path)) {
    if (types.filter((type) => type === 'ProfessionalService').length !== 1 || types.includes('Organization')) {
      throw new Error(`${path}: expected exactly one ProfessionalService business entity`);
    }
    const business = data.find((item) => item['@type'] === 'ProfessionalService');
    if (business['@id'] !== `${siteOrigin}/#organization` ||
        !Array.isArray(business.contactPoint) || business.contactPoint.length !== 1 ||
        business.contactPoint[0]?.telephone !== siteFacts.phoneUS ||
        business.telephone !== siteFacts.phoneUS ||
        business.address?.streetAddress !== postalAddress.streetAddress ||
        business.address?.postalCode !== postalAddress.postalCode ||
        business.priceRange !== starterPriceLabel ||
        !Array.isArray(business.sameAs) || business.sameAs.length !== 6) {
      throw new Error(`${path}: business facts or social links are inconsistent`);
    }
  }
  if (['/', '/help-center'].includes(path) && !types.includes('FAQPage')) throw new Error(`${path}: missing FAQ schema`);
  if (JSON.stringify(data).includes('https://victorysync.com')) throw new Error(`${path}: non-www schema URL`);
  if (types.includes('Review') || types.includes('AggregateRating')) throw new Error(`${path}: review schema is not allowed`);
  console.log(`${path}: ${types.join(', ')}`);
}
console.log(`Verified structured data on ${paths.length} pages.`);
