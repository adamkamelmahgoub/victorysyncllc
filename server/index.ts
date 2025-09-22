import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'node:path'
import fs from 'node:fs'

const app = express()
const PORT = Number(process.env.PORT || 5000)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const CLIENT_DIST = path.resolve(process.cwd(), 'client', 'dist')
const INDEX_HTML = path.join(CLIENT_DIST, 'index.html')

app.use(express.json())
app.use(cookieParser())

// API routes
import apiRoutes from './routes/index.js'
app.use('/api', apiRoutes)

// --- Static web hosting (SPA or plain static) ---
// Prefer a built SPA in client/dist, fallback to /public
const DIST_DIR = path.resolve(process.cwd(), "client/dist");
const PUBLIC_DIR = path.resolve(process.cwd(), "public");

function hasFile(dir: string, file: string) {
  try { return fs.existsSync(path.join(dir, file)); } catch { return false; }
}

if (hasFile(DIST_DIR, "index.html")) {
  // Serve built SPA
  app.use(express.static(DIST_DIR, { maxAge: "1h", index: "index.html" }));
  app.get("*", (_req, res) => res.sendFile(path.join(DIST_DIR, "index.html")));
  console.log(`[web] Serving built SPA from ${DIST_DIR}`);
} else if (hasFile(PUBLIC_DIR, "index.html")) {
  // Serve plain static site
  app.use(express.static(PUBLIC_DIR, { maxAge: "1h", index: "index.html" }));
  app.get("*", (_req, res) => res.sendFile(path.join(PUBLIC_DIR, "index.html")));
  console.log(`[web] Serving static site from ${PUBLIC_DIR}`);
} else {
  // No UI present; keep API only
  app.get("/", (_req, res) => {
    res
      .status(200)
      .send(
        `VictorySync API is running.<br />` +
          `No web UI found. Add <code>public/index.html</code> or build the SPA into <code>client/dist</code>.`
      );
  });
  console.warn(
    "[web] No UI found. Create public/index.html (static) OR run `npm --prefix client run build` to produce client/dist."
  );
}

app.listen(PORT, '0.0.0.0', () => {
  if (fs.existsSync(INDEX_HTML)) {
    console.log('Serving built SPA')
  } else {
    console.log(`No built SPA found at ${INDEX_HTML}. Serving API only. FRONTEND_URL=${FRONTEND_URL}`)
  }
  console.log(`VictorySync API running on :${PORT}`)
})