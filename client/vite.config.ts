
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react({ fastRefresh: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared")
    }
  },
  server: {
    host: true,
    port: 5173,
    hmr: { clientPort: 443 },
    allowedHosts: true
  },
  build: { outDir: "dist" }
});
