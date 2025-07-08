#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { build } from 'esbuild';

// Create dist directory if it doesn't exist
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
}

console.log('🚀 Starting VictorySync deployment build...');

// Step 1: Build client (frontend)
console.log('📦 Building client (frontend)...');
try {
  execSync('npm run build:client', { 
    stdio: 'inherit',
    timeout: 300000 // 5 minutes timeout
  });
  console.log('✅ Client build completed');
} catch (error) {
  console.error('❌ Client build failed:', error.message);
  process.exit(1);
}

// Step 2: Build server with proper external dependencies
console.log('🔨 Building server bundle...');

// Comprehensive list of external dependencies that should not be bundled
const external = [
  // Core Node.js modules
  'pg-native',
  'bufferutil',
  
  // CSS processing dependencies (the main culprits)
  'lightningcss',
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
  
  // Build-time dependencies
  '@babel/preset-typescript',
  '@jridgewell/trace-mapping',
  'autoprefixer',
  'tailwindcss',
  'postcss',
  'vite',
  '@vitejs/plugin-react',
  '@replit/vite-plugin-cartographer',
  '@replit/vite-plugin-runtime-error-modal',
  '@tailwindcss/vite',
  '@tailwindcss/typography',
  'esbuild',
  
  // Optional peer dependencies
  'fsevents',
  'utf-8-validate',
  
  // Development dependencies that might get pulled in
  'drizzle-kit',
  'tsx',
  'typescript'
];

try {
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
    minify: process.env.NODE_ENV === 'production',
    sourcemap: false,
    logLevel: 'info',
    metafile: false,
    treeShaking: true,
    allowOverwrite: true
  });
  
  console.log('✅ Server bundle built successfully');
} catch (error) {
  console.error('❌ Server build failed:', error);
  process.exit(1);
}

console.log('🎉 VictorySync deployment build completed successfully!');
console.log('📁 Built files:');
console.log('  - dist/public/ (client assets)');
console.log('  - dist/server.js (server bundle)');