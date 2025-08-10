
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Permanent Replit-safe Vite config:
 *  - host:true allows binding to 0.0.0.0
 *  - allowedHosts:true disables the hostname check (works for any random *.replit.dev)
 *  - HMR over WSS on 443 avoids blocked mixed-content/socket issues
 *  - usePolling helps in sandboxes
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,               // bind 0.0.0.0
    allowedHosts: true,       // <- key fix: allow any host (covers all *.replit.dev/*.repl.co)
    strictPort: false,
    cors: true,
    watch: { usePolling: true, interval: 150 },
    hmr: {
      protocol: 'wss',
      clientPort: 443
      // (no host set -> uses current origin; works across dynamic Replit subdomains)
    }
  },
  preview: {
    host: true,               // allow preview to bind 0.0.0.0
    strictPort: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
