
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy API to server:5000 during dev
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
