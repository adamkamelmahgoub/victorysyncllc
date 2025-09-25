import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
resolve: {
  alias: {
    "@": resolve(__dirname, "client/src"),
    "@shared": resolve(__dirname, "shared"),
    "@assets": resolve(__dirname, "attached_assets"),
  }
},

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  export default defineConfig({
  plugins: [ … ],
  //  ▼ keep this ONE resolve block
  resolve: {
    alias: {
      "@":        resolve(__dirname, "client/src"),
      "@shared":  resolve(__dirname, "shared"),        // ← this is the line you just added
      "@assets":  resolve(__dirname, "attached_assets")
    }
  },

  // rest of config (root, build, server …)
});

  root: path.resolve(import.meta.dirname, "client"),
  build: {
  outDir: resolve(__dirname, "client/dist"), // whatever you already use
  emptyOutDir: true,
  rollupOptions: {
    external: [],
  },
},
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      port: 5000,
      host: '0.0.0.0'
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
