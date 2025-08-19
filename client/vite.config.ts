
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal'

// IMPORTANT: Don't use __dirname here; use process.cwd() which points to repo root
export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'client/src'),
      '@shared': path.resolve(process.cwd(), 'shared'),
      '@assets': path.resolve(process.cwd(), 'attached_assets'),
    }
  },
  server: {
    host: true,
    port: 5173,
    hmr: { clientPort: 443 },
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true
  }
})
