
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Compute Replit hostname for HMR
const REPL_HOST = process.env.REPL_SLUG && process.env.REPL_OWNER 
  ? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` 
  : "localhost";

export default defineConfig({
  plugins: [react()],
  root: "./client",
  build: {
    outDir: "./dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: "wss",
      clientPort: 443,
      host: REPL_HOST
    },
    proxy: {
      "/api": "http://localhost:5000",
      "/webhooks": "http://localhost:5000"
    }
  },
});
