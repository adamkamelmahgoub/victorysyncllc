
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    hmr: {
      clientPort: 443, // Replit tunnels HMR through 443
    },
    fs: {
      strict: false,
    },
  },
  preview: {
    port: 5173,
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
