
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Detect Replit container
const isReplit = !!process.env.REPL_ID || !!process.env.REPLIT_DB_URL;

// When running in Replit, HMR off (prevents WS flaps → page flicker).
// Locally, keep secure WSS for browser previews that are https.
const hmrConfig = isReplit
  ? false
  : {
      protocol: "wss",
      clientPort: 443,
      path: "/hmr",
    };

export default defineConfig({
  plugins: [react({ fastRefresh: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: true,
    hmr: hmrConfig,
    watch: {
      // FS polling is more stable in Replit containers
      usePolling: true,
      interval: 300,
      awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 300 },
    },
  },
  build: { outDir: "dist" },
});
