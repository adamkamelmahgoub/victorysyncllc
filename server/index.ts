
import "dotenv/config";
import path from "path";
import express from "express";
import { registerRoutes } from "./routes";

const app = express();
const PORT = Number(process.env.PORT || 5000);
const DEV_STATIC = process.env.DEV_STATIC === "1";

app.set("trust proxy", 1);
app.use(express.json());

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// API routes
registerRoutes(app);

// Static client in dev-static mode (CI/build runs vite first)
if (DEV_STATIC) {
  const distDir = path.resolve(__dirname, "../client/dist");
  app.use(express.static(distDir));
  // SPA fallback for anything not /api
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[express] serving on port ${PORT}`);
});
