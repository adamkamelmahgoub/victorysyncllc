
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security and middleware
app.use(helmet());
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));

const isProd = process.env.NODE_ENV === "production";
const clientRoot = path.resolve(__dirname, "../client");
const dist = path.resolve(clientRoot, "dist");

async function start() {
  // Register API routes first
  await registerRoutes(app);

  if (!isProd) {
    // Vite middleware in dev
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: clientRoot,
      server: { middlewareMode: true, hmr: { clientPort: 443 } },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      try {
        const html = await vite.transformIndexHtml(req.originalUrl, `
          <!doctype html><html><head><meta charset="utf-8"/></head>
          <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>
        `);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) { 
        vite.ssrFixStacktrace(e as Error); 
        next(e); 
      }
    });
  } else {
    // Static dist with SPA fallback
    app.use(express.static(dist));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(dist, "index.html"));
    });
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Server running on http://0.0.0.0:${port}`);
    console.log(`Health check: http://0.0.0.0:${port}/health`);
  });
}

start().catch(console.error);
