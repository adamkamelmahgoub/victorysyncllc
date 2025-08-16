import express from "express";
import path from "path";
import fs from "node:fs";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
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

// Health probe so Replit keeps process alive
app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

const isProd = process.env.NODE_ENV === "production";
const clientRoot = path.resolve(__dirname, "../client");
const dist = path.join(clientRoot, "dist");

async function boot() {
  // Register API routes first
  await registerRoutes(app);

  if (!isProd) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      root: clientRoot,
      server: { middlewareMode: true, hmr: { clientPort: 443 }, watch: { usePolling: true } },
      appType: "custom"
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      try {
        const indexHtmlPath = path.resolve(clientRoot, "index.html");
        let html = fs.readFileSync(indexHtmlPath, "utf-8");

        // Let Vite inject @vite/client and React refresh preamble
        html = await vite.transformIndexHtml(req.originalUrl, html);

        // EXTRA GUARANTEE: if the preamble wasn't injected (edge cases), inject it manually
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
    // Serve built client with SPA fallback
    app.use(express.static(dist));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(dist, "index.html"));
    });
  }

  const port = Number(process.env.PORT) || 5000;
  app.listen(port, "0.0.0.0", async () => {
    console.log(`🎉 VictorySync running on http://0.0.0.0:${port}`);
    console.log(`Health: http://0.0.0.0:${port}/health`);
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

boot();