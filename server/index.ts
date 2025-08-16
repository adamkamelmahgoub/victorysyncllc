import express from "express";
import path from "path";
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
app.use(helmet());
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
      server: { middlewareMode: true, hmr: { clientPort: 443 } },
      appType: "custom"
    });
    app.use(vite.middlewares);

    // SPA fallback in dev (serve index.html for non-/api routes)
    app.get("*", async (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      try {
        const html = await vite.transformIndexHtml(
          req.originalUrl,
          `<!doctype html>
           <html><head><meta charset="utf-8"/></head>
           <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`
        );
        res.status(200).setHeader("Content-Type", "text/html").end(html);
      } catch (err) { vite.ssrFixStacktrace(err as Error); next(err); }
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