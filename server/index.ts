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

// ______________________________________
// Replit / static-dev detection
const IN_REPLIT = !!process.env.REPL_ID || !!process.env.REPLIT_DB_URL;
const DEV_STATIC = IN_REPLIT || process.env.DEV_STATIC === "1";
const NODE_ENV = process.env.NODE_ENV ?? "development";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 5000);
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
  // Local (non-Replit) dev can still use Vite middleware if you want.
  // For Replit we don't use this branch.
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    root: path.resolve(__dirname, "../client"),
    server: {
      middlewareMode: true,
      hmr: { protocol: "wss", clientPort: 443, path: "/hmr" },
      watch: { usePolling: true, interval: 300, awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 300 } },
    },
    appType: "custom"
  });
  app.use(vite.middlewares);
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
        html = html.replace("</head>", `${preamble}
</head>`);
      }

      res.status(200).setHeader("Content-Type", "text/html").end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// ______________________________________
// Keep-alive so proxy doesn't kill sockets prematurely
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🎉 VictorySync server is running successfully!`);
  console.log(`[express] serving on port ${PORT}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
});
server.keepAliveTimeout = 70_000;
server.headersTimeout = 75_000;
server.on("connection", s => s.setKeepAlive(true, 60_000));

// Never hard-crash the process for unhandled errors
process.on("unhandledRejection", (e) => console.error("UNHANDLED REJECTION", e));
process.on("uncaughtException", (e) => console.error("UNCAUGHT EXCEPTION", e));

async function main() {
  try {
    await import("dotenv/config");
  } catch {
    // ignore in Replit or prod where env comes from platform
  }
}

main().catch((err) => {
  console.error("Fatal boot error:", err);
  process.exit(1);
});