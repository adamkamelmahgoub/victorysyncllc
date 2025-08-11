

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Detect Replit environment
const isReplit =
  Boolean(process.env.REPL_ID || process.env.REPL_SLUG || process.env.REPLIT_DB_URL);

// Try to infer the preview host if Replit provides one (best effort)
const replitHost =
  process.env.REPLIT_HOSTNAME ||
  process.env.REPL_HOST ||
  undefined;

// IMPORTANT: Only change Vite config. Do not touch app code.
export default defineConfig({
  root: 'client',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/client/src',
      '@shared': '/shared'
    }
  },
  server: {
    host: true,                                     // listen on 0.0.0.0 for Replit
    port: Number(process.env.PORT) || 5173,
    strictPort: false,
    // Allow all hosts inside Replit; keep local strict
    allowedHosts: isReplit ? true : ['localhost', '127.0.0.1'],
    // HMR over secure WebSocket fixes Replit preview reloads
    hmr: isReplit
      ? {
          protocol: 'wss',
          clientPort: 443,
          host: replitHost, // undefined is OK; Vite will use current origin
        }
      : undefined,
  },
  preview: {
    allowedHosts: isReplit ? true : ['localhost'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

