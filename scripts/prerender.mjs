import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'dist', 'public');
const sitemap = readFileSync(join(out, 'sitemap.xml'), 'utf8');
const paths = [...sitemap.matchAll(/<loc>https:\/\/www\.victorysync\.com([^<]*)<\/loc>/g)]
  .map((match) => match[1] || '/');
if (!paths.length) throw new Error('No www URLs found in sitemap.xml');

let chrome = process.env.CHROME_PATH ||
  ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
   'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
   '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']
    .find(existsSync);
let browserArgs = ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--disable-background-networking'];
let headless = true;
if (!chrome && process.platform === 'linux') {
  const chromium = (await import('@sparticuz/chromium')).default;
  chrome = await chromium.executablePath();
  browserArgs = chromium.args;
  headless = 'shell';
}
if (!chrome) throw new Error('Prerender needs Chrome or Chromium. Set CHROME_PATH.');

const port = 41737;
const preview = spawn(process.execPath, [join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
  'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  cwd: root, stdio: ['ignore', 'pipe', 'pipe'],
});
let previewError = '';
preview.stderr.on('data', (chunk) => { previewError += chunk; });

let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (preview.exitCode !== null) throw new Error(previewError || 'Vite preview exited');
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      ready = response.ok;
      if (ready) break;
    } catch {}
    await new Promise((done) => setTimeout(done, 250));
  }
  if (!ready) throw new Error('Vite preview did not start: ' + previewError);

  browser = await puppeteer.launch({ executablePath: chrome, headless, args: browserArgs });
  for (const path of paths) {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().startsWith(`http://127.0.0.1:${port}/`) || request.url().startsWith('data:')) {
        request.continue();
      } else {
        request.abort();
      }
    });
    await page.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction((expected) => {
      return document.querySelector('h1') !== null &&
        document.querySelector('link[rel="canonical"]')?.getAttribute('href') === expected;
    }, { timeout: 30000 }, `https://www.victorysync.com${path}`);
    const html = await page.content();
    await page.close();
    const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
    if (!html.startsWith('<!DOCTYPE html>') ||
        !/<h1[\s>]/i.test(html) ||
        canonical !== `https://www.victorysync.com${path}` || !title ||
        title === 'VictorySync | Human-Led Call Center & Appointment Setting') {
      throw new Error(`Prerender failed for ${path}`);
    }
    const destination = path === '/' ? join(out, 'index.html') : join(out, path, 'index.html');
    mkdirSync(resolve(destination, '..'), { recursive: true });
    writeFileSync(destination, html);
    console.log(`Prerendered ${path}: ${Buffer.byteLength(html)} bytes`);
  }
} finally {
  await browser?.close();
  preview.kill();
}
