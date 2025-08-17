
import express from "express"
import path from "node:path"
import cookieParser from "cookie-parser"
import cors from "cors"
import compression from "compression"
import helmet from "helmet"
import routes from "./routes"
import { seedData } from "./db/seed"

const isDev = process.env.NODE_ENV !== "production"
const DEV_STATIC = process.env.DEV_STATIC === "1"
const PORT = Number(process.env.PORT || 5000)

async function main() {
  const app = express()
  app.disable("x-powered-by")
  app.use(helmet())
  app.use(cors({ origin: true, credentials: true }))
  app.use(cookieParser())
  app.use(express.json({ limit: "2mb" }))
  app.use(compression())

  app.get("/health", (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV, time: new Date().toISOString() }))
  app.use("/api", routes)

  if (isDev && !DEV_STATIC) {
    const vite = await (await import("vite")).createServer({
      root: path.resolve(process.cwd(), "client"),
      server: { middlewareMode: true, hmr: { clientPort: 443 }, host: true, port: 5173, allowedHosts: true }
    })
    app.use(vite.middlewares)
    app.get(/^(?!\/api).*/, async (_req, res) => {
      const html = await vite.transformIndexHtml("/", "<!DOCTYPE html><html><head></head><body><div id='root'></div><script type='module' src='/src/main.tsx'></script></body></html>")
      res.status(200).set({ "Content-Type": "text/html" }).end(html)
    })
  } else {
    const dist = path.resolve(process.cwd(), "client/dist")
    app.use(express.static(dist))
    app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, "index.html")))
  }

  // Initialize database and seed data
  await seedData()

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎉 VictorySync server running on :${PORT}`)
    console.log(`Health: http://0.0.0.0:${PORT}/health`)
  })
  process.on("SIGTERM", () => server.close(() => process.exit(0)))
  process.on("SIGINT", () => server.close(() => process.exit(0)))
}
main().catch((e) => { console.error("Fatal boot error:", e); process.exit(1) })
