import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import vm from 'node:vm';
import { SITE, PAGES } from '../pages.js';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'dist', 'public');
const prototype = readFileSync(join(root, 'template.html'), 'utf8');
const fontWeights = { inter: [400, 500, 600, 700, 800, 900], 'jetbrains-mono': [400, 500, 600] };
const fontDir = join(out, 'seo-fonts'); mkdirSync(fontDir, { recursive: true });
let fontCss = '';
for (const [family, weights] of Object.entries(fontWeights)) for (const weight of weights) {
  const file = `${family}-latin-${weight}-normal.woff2`;
  copyFileSync(join(root, 'node_modules', '@fontsource', family, 'files', file), join(fontDir, file));
  fontCss += `@font-face{font-family:'${family === 'inter' ? 'Inter' : 'JetBrains Mono'}';src:url('/seo-fonts/${file}') format('woff2');font-weight:${weight};font-style:normal;font-display:swap}`;
}
const css = fontCss + prototype.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/\/\* preview switcher[\s\S]*?\/\* nav \*\//, '/* nav */');
const script = prototype.match(/<script>([\s\S]*?)<\/script>/)[1];
const logic = script.slice(script.indexOf('const $ ='), script.indexOf('const pick ='));
const context = vm.createContext({ SITE, PAGES, LOGO: '', matchMedia: () => ({ matches: false }), document: {}, window: {}, console });
vm.runInContext(logic + '\n globalThis.templates = {nav, servicePage, comparePage, bubble, howWeStart};', context);
const { nav, servicePage, comparePage, bubble, howWeStart } = context.templates;
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json = (value) => JSON.stringify(value).replace(/</g, '\\u003c');
const googleTag = `<!-- Google tag (gtag.js) --><script async src="https://www.googletagmanager.com/gtag/js?id=G-7DG7J3MKTB"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied'});if(localStorage.getItem('vs-cookie-consent-v1')==='accepted'&&!navigator.globalPrivacyControl){gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted'});}gtag('config','G-7DG7J3MKTB');</script>`;
const organization = { '@type': 'Organization', name: 'Victory Sync LLC', url: SITE.url, telephone: '+17323286846', address: { '@type': 'PostalAddress', addressLocality: 'Millstone', addressRegion: 'NJ', addressCountry: 'US' } };
for (const p of PAGES) {
  const canonical = `${SITE.url}/${p.slug}`;
  const schema = [p.kind === 'service' ? { '@context': 'https://schema.org', '@type': 'Service', name: p.eyebrow, serviceType: p.eyebrow, provider: organization, areaServed: { '@type': 'Country', name: 'United States' } } : { '@context': 'https://schema.org', '@type': 'Article', headline: p.h1.join(' '), author: organization, publisher: organization }, { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }, { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url }, { '@type': 'ListItem', position: 2, name: p.eyebrow, item: canonical }] }];
  let body = nav() + `<main>${p.kind === 'compare' ? comparePage(p) + howWeStart() : servicePage(p)}</main><footer><div class="wrap"><span>© 2026 Victory Sync LLC · Millstone, NJ</span><nav aria-label="Compare"><a href="/in-house-receptionist-vs-outsourced">In-house vs outsourced</a> · <a href="/ai-receptionist-vs-answering-service">AI vs live answering</a></nav><span class="mono">${SITE.phone}</span></div></footer><div class="sticky"><a class="btn btn-primary" href="${SITE.cta}" target="_blank" rel="noopener">${SITE.ctaLabel}</a></div>`;
  body = body.replace(/href="#([a-z0-9-]+)"/g, (_, slug) => slug === 'how' || slug === 'faq' ? `href="#${slug}"` : `href="/${slug}"`).replace(/<a class="brand" href="[^"]+">/, '<a class="brand" href="/">').replace(/<img src="data:image\/png;base64,[^"]+" alt="">/, '<img src="/LOGO_VS.webp" alt="">');
  if (p.kind === 'service') {
    body = body.replace('<div class="transcript" id="tr"></div>', `<div class="transcript" id="tr">${p.transcript.map(bubble).join('')}</div>`).replaceAll('class="sum-row"', 'class="sum-row on"');
    const c = p.calc;
    const reached = c.reactivation ? c.missed * 0.6 : 0;
    const lost = c.reactivation ? reached : p.mode === 'lead' ? c.missed * 0.3 : c.missed * 4.33 * c.bookRate / 100;
    const jobs = c.reactivation ? reached * c.bookRate / 100 : p.mode === 'lead' ? lost * c.bookRate / 100 : lost;
    const monthly = jobs * c.value;
    const money = n => '$' + Math.round(n).toLocaleString('en-US');
    body = body.replace('<div class="big" id="big">$0', `<div class="big" id="big">${money(monthly)}`).replace('<b id="r1">0</b>', `<b id="r1">${Math.round(c.reactivation ? reached : p.mode === 'lead' ? lost : jobs).toLocaleString('en-US')}</b>`).replace('<b id="r2">$0</b>', `<b id="r2">${c.reactivation ? Math.round(jobs).toLocaleString('en-US') : money(monthly * 12)}</b>`);
  }
  const interactive = p.kind === 'service' ? `<script type="module">\nconst SITE=${json(SITE)},PAGES=[],LOGO='';const p=${json(p)};\n${logic}\nrunHero(p);runTranscript(p);runRules();runCalc(p);\nwindow.addEventListener('pagehide',clearTimers);\n</script>` : '';
  const html = `<!doctype html><html lang="en"><head>${googleTag}<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.title)}</title><meta name="description" content="${esc(p.description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(p.title)}"><meta name="twitter:card" content="summary"><meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${canonical}"><meta name="twitter:title" content="${esc(p.title)}"><meta name="twitter:description" content="${esc(p.description)}"><meta name="twitter:url" content="${canonical}"><style>${css}</style>${schema.map(x => `<script type="application/ld+json">${json(x)}</script>`).join('')}</head><body>${body}${interactive}</body></html>`;
  const dir = join(out, p.slug); mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, 'index.html'), html);
}
for (const sitemapPath of [join(out, 'sitemap.xml'), join(root, 'client', 'public', 'sitemap.xml'), join(root, 'public', 'sitemap.xml')]) {
  let sitemap = readFileSync(sitemapPath, 'utf8');
  for (const p of PAGES) if (!sitemap.includes(`<loc>${SITE.url}/${p.slug}</loc>`)) sitemap = sitemap.replace('</urlset>', `  <url><loc>${SITE.url}/${p.slug}</loc><priority>0.8</priority></url>\n</urlset>`);
  writeFileSync(sitemapPath, sitemap);
}
