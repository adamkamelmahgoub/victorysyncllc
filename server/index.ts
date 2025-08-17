
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import { registerRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 5000);
const DEV_STATIC = process.env.DEV_STATIC === "1";

app.set("trust proxy", 1);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// API
registerRoutes(app);

// Serve built client when DEV_STATIC=1 (vite already ran)
if (DEV_STATIC) {
  const distDir = path.resolve(__dirname, "../client/dist");
  app.use(express.static(distDir));
  // SPA fallback — everything not /api should serve index.html
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[express] serving on port ${PORT}`);
});
