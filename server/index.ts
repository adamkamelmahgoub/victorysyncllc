
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

// ---------- API ROUTES (JSON ONLY) ----------
const api = express.Router();

// Health check (used for diagnostics)
api.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// Auth status endpoints (cover several common paths your UI may call)
const authHandler = (_req: express.Request, res: express.Response) => {
  // If you have real auth, replace this with your session/user logic
  res.json({
    ok: true,
    authenticated: false,
    user: null
  });
};
api.get("/auth", authHandler);
api.get("/auth/", authHandler);
api.get("/auth/check", authHandler);
api.get("/auth/status", authHandler);
api.get("/auth/me", authHandler);

// Catch-all for unknown API routes -> ALWAYS JSON
api.all("*", (req, res) => {
  res.status(404).json({ ok: false, error: "Not found", path: req.path });
});

// Mount the API BEFORE static and SPA fallback
app.use("/api", api);

// ---------- STATIC + SPA FALLBACK ----------
const dist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(dist));

// Any non-API route -> return the app shell
app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));

app.listen(PORT, () => console.log(`✅ API+SPA server on :${PORT}`));
