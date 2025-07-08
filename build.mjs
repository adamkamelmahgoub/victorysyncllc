#!/usr/bin/env node

import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// External dependencies that should not be bundled
const external = [
  'pg-native',
  'lightningcss',
  '@babel/preset-typescript',
  '@jridgewell/trace-mapping',
  // CSS processing dependencies
  'lightningcss-darwin-arm64',
  'lightningcss-darwin-x64',
  'lightningcss-freebsd-x64',
  'lightningcss-linux-arm-gnueabihf',
  'lightningcss-linux-arm64-gnu',
  'lightningcss-linux-arm64-musl',
  'lightningcss-linux-x64-gnu',
  'lightningcss-linux-x64-musl',
  'lightningcss-win32-arm64-msvc',
  'lightningcss-win32-x64-msvc',
  // Other build-time dependencies
  'autoprefixer',
  'tailwindcss',
  'postcss',
  'vite',
  '@vitejs/plugin-react',
  '@replit/vite-plugin-cartographer',
  '@replit/vite-plugin-runtime-error-modal',
  '@tailwindcss/vite',
  'esbuild'
];

try {
  console.log('🔨 Building server bundle...');
  
  await build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: 'dist/server.js',
    external,
    format: 'esm',
    banner: {
      js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);'
    },
    minify: false,
    sourcemap: false,
    logLevel: 'info'
  });
  
  console.log('✅ Server bundle built successfully');
} catch (error) {
  console.error('❌ Server build failed:', error);
  process.exit(1);
}