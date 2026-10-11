import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { publicRoutes } from './route-manifest.mjs';
import { siteFacts } from '../client/src/config/siteFacts.ts';

const root = resolve(import.meta.dirname, '..');
const publicDir = resolve(root, 'client', 'public');
const origin = 'https://www.victorysync.com';

const routeSource = (path) => {
  if (path === '/') return 'client/src/pages/home.tsx';
  if (path === '/terms') return 'client/src/pages/terms.tsx';
  if (path === '/privacy-policy') return 'client/src/pages/privacy-policy.tsx';
  if (path === '/faq' || path === '/how-it-works' || path === '/clients') return 'client/src/pages/public-page.tsx';
  if (['/appointment-setting-for-home-services', '/cold-calling-for-plumbers', '/answering-service-for-plumbers', '/appointment-setting-for-hvac', '/appointment-setting-for-real-estate', '/inbound-support-for-law-firms'].includes(path)) {
    return 'client/src/pages/vertical-services.tsx';
  }
  return `client/src/pages/${path.slice(1)}.tsx`;
};

const paths = new Set(publicRoutes.map((route) => route.path));
if (paths.size !== publicRoutes.length || !paths.has('/')) throw new Error('Route manifest contains duplicate paths or no homepage');

const today = new Date().toISOString().slice(0, 10);
const lastModified = (path) => {
  const source = routeSource(path);
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', source], { cwd: root, encoding: 'utf8' }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  } catch { /* Deployment source may not include Git history. */ }
  return today;
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicRoutes.map(({ path, priority, changefreq }) => `  <url><loc>${origin}${path}</loc><lastmod>${lastModified(path)}</lastmod><changefreq>${changefreq || 'monthly'}</changefreq><priority>${priority}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap);

const pageLines = publicRoutes.map(({ path, label, summary }) => `- [${label}](${origin}${path}): ${summary}`).join('\n');
const pricingLines = [
  `Service starts from $${siteFacts.starterRateUsd} per agent hour. Final pricing depends on campaign scope.`,
  siteFacts.pilotDescription ? `Paid pilot: ${siteFacts.pilotDescription}.` : null,
].filter(Boolean).join('\n\n');
const serviceLines = [
  '- Inbound customer support and call answering',
  '- Outbound appointment setting and lead follow-up',
  '- Cold calling and lead qualification',
  '- AI-assisted call summaries, CRM updates, routing, reminders, and reporting',
  siteFacts.digitalMarketingDetails ? `- Digital marketing: ${siteFacts.digitalMarketingDetails.services.join(', ')}` : null,
].filter(Boolean).join('\n');
const launchLines = [
  `Straightforward campaigns can often launch within ${siteFacts.straightforwardLaunchTimeframe} after scripts, lists, access, and escalation rules are approved.`,
  siteFacts.complexLaunchTimeframe ? `Campaigns that need a CRM integration or compliance review usually take ${siteFacts.complexLaunchTimeframe}.` : null,
].filter(Boolean).join('\n\n');
const hoursLines = [
  siteFacts.hours,
  typeof siteFacts.afterHoursCoverage === 'string' ? siteFacts.afterHoursCoverage : null,
].filter(Boolean).join('\n\n');

const llms = `# ${siteFacts.brandName}

${siteFacts.legalName} provides US-managed contact center services with Cairo-based agents for appointment setting, cold calling, lead qualification, and inbound customer support.

## Services

${serviceLines}

## Who we work with

Home services, including plumbing and HVAC, real estate, legal, and SaaS businesses in the United States.

## Pricing

${pricingLines}

## Launch time

${launchLines}

## Hours

${hoursLines}

## Partners

${siteFacts.brandName} is a Close CRM partner.

## Pages

${pageLines}

## Contact

- US phone: ${siteFacts.phoneUS}
- WhatsApp: ${siteFacts.whatsapp}
- Email: ${siteFacts.email}
- Address: ${siteFacts.address}

## Sitemap

${origin}/sitemap.xml
`;
writeFileSync(resolve(publicDir, 'llms.txt'), llms);
console.log(`Generated per-route sitemap and llms.txt for ${publicRoutes.length} routes.`);
