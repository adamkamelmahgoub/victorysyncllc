
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,              // allow 0.0.0.0
    strictPort: false,       // we won't rely on 5173 being exposed
    hmr: { port: 24678 }     // avoid clashes
  },
  preview: { host: true },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
