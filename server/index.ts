
// server/index.ts
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import routes from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT ?? 5000);

async function main() {
  const app = express();

  // Core middleware
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Health (early)
  app.get("/health", (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

  // Mount API routes (robust, async)
  await routes(app);

  // --- SPA hosting ---
  if (isProd || process.env.DEV_STATIC === "1") {
    const clientDist = path.resolve(__dirname, "../client/dist");
    app.use(express.static(clientDist));
    // SPA fallback for non-/api routes
    app.get(/^(?!\/api\/).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  } else {
    // Dev: attach Vite middleware if you do that in your project,
    // or leave this section as-is if you already set it elsewhere.
    // (Most Replit setups build and serve static from dist even in dev.)
  }

  // Start server
  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 VictorySync server listening on http://0.0.0.0:${port}`);
  });
}

main().catch((err) => {
  console.error("Fatal boot error:", err);
  process.exit(1);
});
