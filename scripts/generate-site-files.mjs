import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { publicRoutes } from './route-manifest.mjs';

const root = resolve(import.meta.dirname, '..');
const publicDir = resolve(root, 'client', 'public');
const origin = 'https://www.victorysync.com';
let lastmod = new Date().toISOString().slice(0, 10);
try {
  lastmod = execFileSync('git', ['log', '-1', '--format=%cs', '--', 'client/src', 'client/public', 'client/index.html'], { cwd: root, encoding: 'utf8' }).trim() || lastmod;
} catch { /* Deployment source may not include Git history. */ }
if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) throw new Error(`Invalid sitemap lastmod: ${lastmod}`);

const paths = new Set(publicRoutes.map((route) => route.path));
if (paths.size !== publicRoutes.length || !paths.has('/')) throw new Error('Route manifest contains duplicate paths or no homepage');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicRoutes.map(({ path, priority, changefreq }) =>
  `  <url><loc>${origin}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq || 'monthly'}</changefreq><priority>${priority}</priority></url>`).join('\n')}\n</urlset>\n`;
writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap);

const pages = publicRoutes.map(({ path, label, summary }) => `- [${label}](${origin}${path}): ${summary}`).join('\n');
const llms = `# VictorySync\n\nVictorySync is a US-managed contact center with Cairo-based agents for appointment setting, cold calling, lead qualification, and inbound customer support.\n\n## Services and coverage\n\nServices include inbound customer support, outbound appointment setting, cold calling, and AI-assisted operations. VictorySync serves businesses in the United States, including home services, plumbing, real estate, and legal practices. Straightforward campaigns can often launch within 24 to 48 hours after scripts, access, and escalation rules are approved. VictorySync is a Close CRM partner.\n\nStarter service begins at $10 per agent hour for one trained agent and one inbound or outbound workflow. Final pricing depends on campaign scope.\n\n## Pages\n\n${pages}\n\n## Contact\n\n- US phone: +1 848-216-1220\n- WhatsApp: +20-107-039-4707\n- Email: info@victorysync.com\n- Address: 11 Brookside Road, Millstone Township, NJ 08510\n- Hours: Monday to Friday, 9:00am to 6:00pm Eastern\n\nSitemap: ${origin}/sitemap.xml\n`;
writeFileSync(resolve(publicDir, 'llms.txt'), llms);
console.log(`Generated sitemap and llms.txt for ${publicRoutes.length} routes (lastmod ${lastmod}).`);
