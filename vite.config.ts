import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // --- ADD THIS 'define' SECTION TO FIX THE ERROR ---
  define: {
    'process.env': {}
  },
  // -------------------------------------------------

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
