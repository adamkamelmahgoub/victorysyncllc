
// server/index.ts
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import registerRoutes from "./routes";

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

  // Optional top-level health
  app.get("/health", (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

  // ----- API under /api -----
  await registerRoutes(app);

  // ----- SPA hosting & fallback -----
  const clientDist = path.resolve(__dirname, "../client/dist");
  if (isProd || process.env.DEV_STATIC === "1") {
    app.use(express.static(clientDist));
  }

  // Anything NOT starting with /api should serve index.html (SPA fallback)
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 VictorySync server listening on http://0.0.0.0:${port}`);
  });
}

main().catch((err) => {
  console.error("Fatal boot error:", err);
  process.exit(1);
});
