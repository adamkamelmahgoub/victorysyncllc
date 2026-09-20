import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'dist', 'public');
const sitemap = readFileSync(join(out, 'sitemap.xml'), 'utf8');
const paths = [...sitemap.matchAll(/<loc>https:\/\/www\.victorysync\.com([^<]*)<\/loc>/g)]
  .map((match) => match[1] || '/');
if (!paths.length) throw new Error('No www URLs found in sitemap.xml');

const chrome = process.env.CHROME_PATH ||
  ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
   'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
   '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']
    .find(existsSync);
if (!chrome) throw new Error('Prerender needs Chrome or Chromium. Set CHROME_PATH.');

const port = 41737;
const preview = spawn(process.execPath, [join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
  'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  cwd: root, stdio: ['ignore', 'pipe', 'pipe'],
});
let previewError = '';
preview.stderr.on('data', (chunk) => { previewError += chunk; });

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

  for (const path of paths) {
    const profile = join(tmpdir(), `victorysync-prerender-${process.pid}`);
    const result = spawnSync(chrome, [
      '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-extensions',
      '--disable-background-networking', '--disable-dev-shm-usage',
      `--user-data-dir=${profile}`, '--virtual-time-budget=5000', '--dump-dom',
      `http://127.0.0.1:${port}${path}`,
    ], { encoding: 'utf8', timeout: 45000, maxBuffer: 16 * 1024 * 1024 });
    rmSync(profile, { recursive: true, force: true });
    const html = result.stdout.slice(result.stdout.indexOf('<!DOCTYPE html>'));
    const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
    if (result.error || !html.startsWith('<!DOCTYPE html>') ||
        !/<h1[\s>]/i.test(html) ||
        canonical !== `https://www.victorysync.com${path}` || !title ||
        title === 'VictorySync | Human-Led Call Center & Appointment Setting') {
      throw new Error(`Prerender failed for ${path}: ${result.error?.message || result.stderr.slice(-800)}`);
    }
    const destination = path === '/' ? join(out, 'index.html') : join(out, path, 'index.html');
    mkdirSync(resolve(destination, '..'), { recursive: true });
    writeFileSync(destination, html);
    console.log(`Prerendered ${path}: ${Buffer.byteLength(html)} bytes`);
  }
} finally {
  preview.kill();
}
