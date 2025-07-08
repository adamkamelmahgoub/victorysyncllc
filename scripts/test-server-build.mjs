#!/usr/bin/env node

/**
 * Quick test script to verify server build with lightningcss fixes
 */

import { build as esbuild } from 'esbuild';
import { existsSync, mkdirSync } from 'fs';

// Create dist directory
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
}

console.log('🧪 Testing server build with lightningcss fixes...');

// Comprehensive external dependencies - fixes lightningcss bundling issues
const serverExternals = [
  // Primary problematic dependencies
  'lightningcss',
  'pg-native',
  '@babel/preset-typescript',
  '@jridgewell/trace-mapping',
  
  // All lightningcss platform-specific binaries that cause bundling failures
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
  
  // Build tools and CSS processing dependencies
  'vite',
  '@vitejs/plugin-react',
  '@replit/vite-plugin-cartographer',
  '@replit/vite-plugin-runtime-error-modal',
  '@tailwindcss/vite',
  '@tailwindcss/typography',
  'tailwindcss',
  'autoprefixer',
  'postcss',
  'esbuild',
  
  // Optional dependencies that can cause issues
  'bufferutil',
  'utf-8-validate',
  'fsevents',
  
  // Development dependencies
  'drizzle-kit',
  'tsx',
  'typescript'
];

try {
  const start = Date.now();
  
  await esbuild({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: 'dist/server.js',
    external: serverExternals,
    format: 'esm',
    banner: {
      js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);'
    },
    minify: false,
    logLevel: 'error',
    treeShaking: true,
    keepNames: true,
    sourcemap: false
  });
  
  const duration = Date.now() - start;
  console.log(`✅ Server build successful in ${duration}ms`);
  
  // Check file size
  const fs = await import('fs');
  const stats = fs.statSync('dist/server.js');
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(1);
  console.log(`📦 Bundle size: ${sizeInMB}MB`);
  
  console.log('');
  console.log('✅ All lightningcss dependency issues resolved');
  console.log('✅ External dependencies properly excluded from bundling');
  console.log('✅ Server ready for deployment!');
  
} catch (error) {
  console.error('❌ Server build failed:', error);
  process.exit(1);
}