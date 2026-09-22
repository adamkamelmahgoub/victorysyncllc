import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { createFont, woff2 } from 'fonteditor-core';
import { siteFacts } from '../client/src/config/siteFacts';

const root = resolve(import.meta.dirname, '..');
const publicDir = resolve(root, 'client', 'public');
const logo = await sharp(resolve(publicDir, 'LOGO_VS.png'))
  .resize(260, 260, { fit: 'contain' })
  .png()
  .toBuffer();
const sourceFont = resolve(root, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-700-normal.woff2');
const fontfile = resolve(tmpdir(), 'victorysync-og-inter.ttf');
await woff2.init();
const inter = createFont(readFileSync(sourceFont), { type: 'woff2' });
writeFileSync(fontfile, Buffer.from(inter.write({ type: 'ttf' })));
const brand = await sharp({ text: { text: `<span foreground="#ffffff">${siteFacts.brandName}</span>`, font: 'Inter 76', fontfile, width: 660, height: 110, rgba: true } }).png().toBuffer();
const tagline = await sharp({ text: { text: '<span foreground="#d8dce7">US-managed call center · Cairo-based agents</span>', font: 'Inter 27', fontfile, width: 680, height: 60, rgba: true } }).png().toBuffer();
const accent = Buffer.from('<svg width="88" height="8" xmlns="http://www.w3.org/2000/svg"><rect width="88" height="8" rx="4" fill="#7B5CF6"/></svg>');
const logoPanel = Buffer.from('<svg width="320" height="320" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="312" height="312" rx="44" fill="#151b31" stroke="#7B5CF6" stroke-width="8"/></svg>');

await sharp({
  create: { width: 1200, height: 630, channels: 4, background: '#0A0F1E' },
})
  .composite([
    { input: logoPanel, left: 70, top: 155 },
    { input: logo, left: 100, top: 185 },
    { input: accent, left: 440, top: 178 },
    { input: brand, left: 440, top: 225 },
    { input: tagline, left: 440, top: 350 },
  ])
  .png()
  .toFile(resolve(publicDir, 'og-image.png'));
unlinkSync(fontfile);

console.log('Generated client/public/og-image.png at 1200x630.');
