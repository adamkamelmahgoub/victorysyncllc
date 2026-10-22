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
  let homepageHtml;
  for (const path of paths) {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => { window.__PRERENDERING__ = true; });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().startsWith(`http://127.0.0.1:${port}/`) || request.url().startsWith('data:')) {
        request.continue();
      } else {
        request.abort();
      }
    });
    await page.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    try {
      await page.waitForFunction((expected) => {
        return window.__CMS_READY__ === true && document.querySelector('h1') !== null &&
          document.querySelector('link[rel="canonical"]')?.getAttribute('href') === expected;
      }, { timeout: 20000 }, `https://www.victorysync.com${path}`);
    } catch (error) {
      const diagnostic = await page.evaluate(() => ({
        title: document.title,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        h1: document.querySelector('h1')?.textContent,
        root: document.querySelector('#root')?.textContent?.slice(0, 150),
      }));
      throw new Error(`Prerender timeout for ${path}: ${JSON.stringify(diagnostic)}; page errors: ${pageErrors.join(' | ')}; ${error.message}`);
    }
    // The build browser runs analytics, but those dynamically inserted scripts must not
    // be baked into static HTML. They would otherwise execute in CMS previews too.
    await page.evaluate(() => {
      document.querySelectorAll('script[src^="http://"], script[src^="https://"]')
        .forEach((script) => {
          if (!script.src.startsWith('https://www.googletagmanager.com/gtag/js?id=G-7DG7J3MKTB')) script.remove();
        });
    });
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
    if (path === '/') {
      // Keep Vite's small SPA shell available as the fallback while rendering other routes.
      homepageHtml = html;
    } else {
      const destination = join(out, path, 'index.html');
      mkdirSync(resolve(destination, '..'), { recursive: true });
      writeFileSync(destination, html);
    }
    console.log(`Prerendered ${path}: ${Buffer.byteLength(html)} bytes`);
  }
  if (!homepageHtml) throw new Error('Homepage was not prerendered');
  writeFileSync(join(out, 'index.html'), homepageHtml);

  const notFoundPage = await browser.newPage();
  await notFoundPage.evaluateOnNewDocument(() => { window.__PRERENDERING__ = true; });
  await notFoundPage.setRequestInterception(true);
  notFoundPage.on('request', (request) => {
    if (request.url().startsWith(`http://127.0.0.1:${port}/`) || request.url().startsWith('data:')) request.continue();
    else request.abort();
  });
  await notFoundPage.goto(`http://127.0.0.1:${port}/this-page-does-not-exist`, { waitUntil: 'domcontentloaded' });
  await notFoundPage.waitForFunction(() => document.querySelector('h1')?.textContent === 'Page not found');
  await notFoundPage.evaluate(() => {
    document.title = 'Page not found | VictorySync';
    document.querySelector('link[rel="canonical"]')?.remove();
    document.querySelectorAll('script[src^="http://"], script[src^="https://"]').forEach((script) => {
      if (!script.src.startsWith('https://www.googletagmanager.com/gtag/js?id=G-7DG7J3MKTB')) script.remove();
    });
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.setAttribute('name', 'robots'); document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
  });
  const notFoundHtml = await notFoundPage.content();
  await notFoundPage.close();
  if (!notFoundHtml.includes('name="robots" content="noindex, follow"') ||
      !['href="/services"', 'href="/pricing"', 'href="/contact"'].every((link) => notFoundHtml.includes(link))) {
    throw new Error('404 page is missing metadata or helpful links');
  }
  writeFileSync(join(out, '404.html'), notFoundHtml);
  console.log(`Prerendered /404: ${Buffer.byteLength(notFoundHtml)} bytes`);
} finally {
  await browser?.close();
  preview.kill();
}
