#!/usr/bin/env node

// Minimal server startup that bypasses Vite development middleware
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set environment to production to avoid Vite middleware
process.env.NODE_ENV = 'production';

const serverPath = join(__dirname, 'server', 'index.ts');

console.log('Starting server in production mode...');
console.log('Frontend available at: http://localhost:5173');

const serverProcess = spawn('npx', ['tsx', serverPath], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: '5000'
  }
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

serverProcess.on('error', (err) => {
  console.error('Failed to start server:', err);
});