import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({ origin: true }));
app.use(express.json());

// --- API routes ---
app.get("/api/health", (_req, res) => res.json({ ok: true }));
// TODO: keep/add your real API routes here (e.g., /api/pricing, /api/contact)

// --- SPA static (prod/preview) ---
const dist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(dist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

app.listen(PORT, () => console.log(`✅ API+SPA server on :${PORT}`));