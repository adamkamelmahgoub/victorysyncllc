
// --- server/index.ts (bootstrap first) ---
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { registerRoutes } from "./routes.js";

// Resolve ESM dirname/filename early
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment & flags — define BEFORE any usage
const NODE_ENV = process.env.NODE_ENV ?? "development";
const isProd = NODE_ENV === "production";
const PORT = Number(process.env.PORT ?? 5000);

// Project roots
const repoRoot = path.resolve(__dirname, "..");               // /workspace/server/..
const clientRoot = path.resolve(repoRoot, "client");          // /workspace/client
const clientDist = path.resolve(clientRoot, "dist");          // /workspace/client/dist

// Create app
const app = express();

// Health check early
app.get("/health", (_req, res) => res.json({ ok: true, env: NODE_ENV }));

// Middleware setup
if (!isProd) {
  app.use(helmet({ contentSecurityPolicy: false }));
} else {
  app.use(helmet());
}
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("tiny"));

async function boot() {
  // Register API routes first
  await registerRoutes(app);

  if (!isProd) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      root: clientRoot,
      server: { middlewareMode: true, hmr: { clientPort: 443 }, watch: { usePolling: true } },
      appType: "custom",
    });
    app.use(vite.middlewares);

    // Serve transformed index.html so Vite injects @vite/client + React refresh preamble
    const fs = await import("node:fs");
    app.get("*", async (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      try {
        const indexPath = path.resolve(clientRoot, "index.html");
        let html = fs.readFileSync(indexPath, "utf-8");
        html = await vite.transformIndexHtml(req.originalUrl, html);

        // Extra guard: if preamble didn't inject for any reason, inject it manually
        if (!html.includes("/@vite/client") || !html.includes("__vite_plugin_react_preamble_installed__")) {
          const preamble = `
            <script type="module" src="/@vite/client"></script>
            <script type="module">
              import RefreshRuntime from "/@react-refresh";
              RefreshRuntime.injectIntoGlobalHook(window);
              window.$RefreshReg$ = () => {};
              window.$RefreshSig$ = () => (type) => type;
              window.__vite_plugin_react_preamble_installed__ = true;
            </script>`;
          html = html.replace("</head>", `${preamble}\n</head>`);
        }

        res.status(200).setHeader("Content-Type", "text/html").end(html);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  } else {
    // Production: serve built SPA with fallback (no changes to public UI)
    const sirv = (await import("sirv")).default;
    app.use(sirv(clientDist, { dev: false, etag: true, single: true }));
  }

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`🎉 VictorySync running on http://0.0.0.0:${PORT} (env=${NODE_ENV})`);
    console.log(`Health: http://0.0.0.0:${PORT}/health`);
    console.log("📦 Initializing default packages...");
    try {
      const { seedDefaultPackages } = await import("./db/seed.js");
      await seedDefaultPackages();
      console.log("📦 Packages ready.");
    } catch (e) {
      console.error("⚠️ Package seed failed (continuing):", e);
      // Do not throw; app must keep running.
    }
  });
}

// Never hard-crash the process for unhandled errors
process.on("unhandledRejection", (e) => console.error("UNHANDLED REJECTION", e));
process.on("uncaughtException", (e) => console.error("UNCAUGHT EXCEPTION", e));

async function main() {
  try {
    await import("dotenv/config");
  } catch {
    // ignore in Replit or prod where env comes from platform
  }
  await boot();
}

main().catch((err) => {
  console.error("Fatal boot error:", err);
  process.exit(1);
});
