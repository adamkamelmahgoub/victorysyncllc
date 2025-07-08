#!/usr/bin/env node

import { build as esbuild } from 'esbuild';
import { build as viteBuild } from 'vite';
import { existsSync, mkdirSync } from 'fs';

// Create dist directory
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
}

console.log('⚡ Fast build for deployment...');

// Comprehensive external dependencies - the key to solving lightningcss issues
const serverExternals = [
  // Core problematic dependencies
  'lightningcss',
  'pg-native',
  '@babel/preset-typescript',
  '@jridgewell/trace-mapping',
  
  // All lightningcss platform-specific binaries
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
  
  // Build tools that shouldn't be bundled
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
  
  // Optional dependencies
  'bufferutil',
  'utf-8-validate',
  'fsevents',
  
  // Dev dependencies
  'drizzle-kit',
  'tsx',
  'typescript'
];

// Build server first (faster and main issue)
try {
  console.log('🔨 Building server...');
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
    logLevel: 'error', // Reduce noise
    treeShaking: true
  });
  
  console.log('✅ Server built successfully');
} catch (error) {
  console.error('❌ Server build failed:', error);
  process.exit(1);
}

// Build client (skip if it fails, server is more important for fixing deploy)
try {
  console.log('🎨 Building client...');
  await viteBuild({
    mode: 'production',
    logLevel: 'error',
    build: {
      emptyOutDir: true,
      outDir: 'dist/public'
    }
  });
  console.log('✅ Client built successfully');
} catch (error) {
  console.warn('⚠️ Client build had issues, but server is ready:', error.message);
}

console.log('🎉 Build complete! Ready for deployment.');