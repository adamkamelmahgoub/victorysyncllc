
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
    hmr: {
      // Replit preview is HTTPS → force secure WS to 443 to avoid mixed-content issues
      protocol: "wss",
      clientPort: 443,
      path: "/hmr", // fixed path improves some proxy setups
      overlay: true,
    },
    // Replit's file system can miss chokidar native events → poll for stability
    watch: {
      usePolling: true,
      interval: 300,
      awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 300 },
    },
  },
  build: { outDir: "dist" },
});
