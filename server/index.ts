
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { registerRoutes } from "./routes.js";
import { createServer } from "http";
import fs from "fs";

// ______________________________________
// Replit / static-dev detection
const IN_REPLIT = !!process.env.REPL_ID || !!process.env.REPLIT_DB_URL;
const DEV_STATIC = IN_REPLIT || process.env.DEV_STATIC === "1";
const NODE_ENV = process.env.NODE_ENV ?? "development";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = NODE_ENV === "production";
const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT || 5000);

// Keep a handle across tsx/hmr reloads
declare global {
  // eslint-disable-next-line no-var
  var __vs_http_server__: import('http').Server | undefined;
  // eslint-disable-next-line no-var
  var __vs_vite__: any | undefined;
}

async function boot() {
  const app = express();

  app.set("trust proxy", 1);

  // Health check early
  app.get("/health", (_req, res) => res.json({ ok: true, env: NODE_ENV }));

  // Middleware setup
  if (NODE_ENV !== "production") {
    app.use(helmet({ contentSecurityPolicy: false }));
  } else {
    app.use(helmet());
  }
  app.use(compression());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(morgan("tiny"));

  // Register API routes
  await registerRoutes(app);

  // ______________________________________
  // SPA: serve built client in Replit (DEV_STATIC) and in production
  const distDir = path.resolve(__dirname, "../client/dist");
  const indexHtml = path.resolve(distDir, "index.html");

  if (NODE_ENV === "production" || DEV_STATIC) {
    app.use(express.static(distDir, { maxAge: NODE_ENV === "production" ? "1h" : 0 }));

    // SPA fallback for non-API routes
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(indexHtml);
    });
  } else {
    // Vite in middleware mode in dev: create only once across reloads
    if (!global.__vs_vite__) {
      const { createServer: createViteServer } = await import("vite");
      const clientRoot = path.resolve(__dirname, "../client");
      global.__vs_vite__ = await createViteServer({
        root: clientRoot,
        server: {
          middlewareMode: true,
          hmr: { protocol: "wss", clientPort: 443, path: "/hmr" },
          watch: { usePolling: true, interval: 300, awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 300 } },
        },
        appType: "custom"
      });
    }
    app.use(global.__vs_vite__.middlewares);
    app.get("*", async (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      try {
        const clientRoot = path.resolve(__dirname, "../client");
        const indexPath = path.resolve(clientRoot, "index.html");
        let html = fs.readFileSync(indexPath, "utf-8");
        html = await global.__vs_vite__.transformIndexHtml(req.originalUrl, html);

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
          html = html.replace("</head>", `${preamble}
</head>`);
        }

        res.status(200).setHeader("Content-Type", "text/html").end(html);
      } catch (e) {
        global.__vs_vite__.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  // Close any previous server (prevents EADDRINUSE on hot reload)
  if (global.__vs_http_server__) {
    await new Promise<void>((resolve) => global.__vs_http_server__!.close(() => resolve()));
    global.__vs_http_server__ = undefined;
  }

  const httpServer = createServer(app);

  httpServer.on('error', (err: any) => {
    if (err?.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} is in use. A previous process is still bound. Retrying after close...`);
    } else {
      console.error('HTTP server error:', err);
    }
  });

  httpServer.keepAliveTimeout = 70_000;
  httpServer.headersTimeout = 75_000;
  httpServer.on("connection", s => s.setKeepAlive(true, 60_000));

  httpServer.listen(PORT, HOST, () => {
    console.log(`🎉 VictorySync server is running successfully!`);
    console.log(`[express] serving on port ${PORT}`);
    console.log(`Health check: http://${HOST}:${PORT}/health`);
  });

  global.__vs_http_server__ = httpServer;

  // Graceful shutdown (Replit stop / restart)
  const shutdown = async () => {
    if (global.__vs_http_server__) {
      await new Promise<void>((resolve) => global.__vs_http_server__!.close(() => resolve()));
      global.__vs_http_server__ = undefined;
    }
    process.exit(0);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // Never hard-crash the process for unhandled errors
  process.on("unhandledRejection", (e) => console.error("UNHANDLED REJECTION", e));
  process.on("uncaughtException", (e) => console.error("UNCAUGHT EXCEPTION", e));
}

// Prevent double boot if this file gets imported twice
if (!(global as any).__vs_booted__) {
  (global as any).__vs_booted__ = true;
  boot().catch((e) => {
    console.error('Fatal boot error:', e);
    process.exit(1);
  });
}
