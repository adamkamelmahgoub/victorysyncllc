#!/usr/bin/env node
// Development server wrapper that handles __dirname polyfill for vite.config.ts
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Set up environment
process.env.NODE_ENV = 'development';

// Create __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
globalThis.__dirname = __dirname;

// Start the server with proper Node.js flags
const serverProcess = spawn('node', [
  '--import', './dirname-polyfill.mjs',
  '--import', 'tsx/esm',
  'server/index.ts'
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  serverProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  serverProcess.kill('SIGINT');
});

serverProcess.on('close', (code) => {
  process.exit(code);
});