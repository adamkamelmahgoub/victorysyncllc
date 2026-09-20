import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const out = resolve(import.meta.dirname, '..', 'dist', 'public');
const sitemap = readFileSync(join(out, 'sitemap.xml'), 'utf8');
const paths = [...sitemap.matchAll(/<loc>(https:\/\/www\.victorysync\.com([^<]*))<\/loc>/g)]
  .map((match) => ({ url: match[1], path: match[2] || '/' }));
const removed = /\/(?:blog(?:\/[^<]*)?|careers|docs)(?:<|\/)/;
if (removed.test(sitemap) || sitemap.includes('https://victorysync.com')) {
  throw new Error('Sitemap contains a removed or non-www URL');
}
if (paths.length < 14) throw new Error(`Expected at least 14 sitemap routes, got ${paths.length}`);
const titles = new Set();
const descriptions = new Set();
for (const { url, path } of paths) {
  const html = readFileSync(join(out, path, 'index.html'), 'utf8');
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)?.[1];
  const h1 = [...html.matchAll(/<h1(?:\s|>)/gi)].length;
  if (canonical !== url || !title || !description || h1 !== 1) {
    throw new Error(`${path}: canonical=${canonical}, title=${title}, description=${description}, h1=${h1}`);
  }
  if (titles.has(title) || descriptions.has(description)) throw new Error(`${path}: duplicate metadata`);
  titles.add(title);
  descriptions.add(description);
  const schemaScripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [, content] of schemaScripts) JSON.parse(content);
  if (html.includes('https://victorysync.com')) throw new Error(`${path}: non-www schema or metadata URL`);
  console.log(`${path} -> ${canonical} | ${title} | H1=${h1} | ${Buffer.byteLength(html)} bytes`);
}
console.log(`Verified ${paths.length} prerendered marketing routes with unique metadata and valid JSON-LD.`);
