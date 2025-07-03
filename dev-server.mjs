#!/usr/bin/env node

// Development server runner that uses tsx to run the TypeScript server
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'server', 'index.ts');

console.log('Starting development server...');

const serverProcess = spawn('npx', ['tsx', 'watch', serverPath], {
  stdio: 'inherit',
  shell: true
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

serverProcess.on('error', (err) => {
  console.error('Failed to start server:', err);
});