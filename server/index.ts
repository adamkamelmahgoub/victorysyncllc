import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

// Import API routes
import { router as healthRouter } from './routes/health.js'
import { router as authRouter } from './routes/auth.js'
import { router as adminRouter } from './routes/admin.js'
import { router as orgRouter } from './routes/org.js'
import { router as integrationRouter } from './routes/integrations.js'
import { router as billingRouter } from './routes/billing.js'
import { router as webhookRouter } from './routes/webhooks.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Basic hardening & json
app.disable('x-powered-by')
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : true,
  credentials: true
}))

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Health check for Replit
app.get('/health', (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' })
})

// Mount API routes BEFORE SPA handler
app.use('/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/org', orgRouter)
app.use('/api/integrations', integrationRouter)
app.use('/api/billing', billingRouter)
app.use('/api/webhooks', webhookRouter)

const isProd = process.env.NODE_ENV === 'production'
const PORT = Number(process.env.PORT) || 5000
const HOST = '0.0.0.0'

async function start() {
  if (!isProd) {
    // DEV: Use Vite in middleware mode on SAME Express port
    const { createServer: createViteServer } = await import('vite')
    const vite = await createViteServer({
      root: path.resolve(__dirname, '../client'),
      server: {
        middlewareMode: true,
        hmr: { port: 24678 },
        watch: { usePolling: true, interval: 150 }
      },
      appType: 'custom'
    })

    app.use(vite.middlewares)

    // Let Vite handle index.html and route fallback
    app.use('*', async (req, res) => {
      try {
        const url = req.originalUrl
        const template = await vite.transformIndexHtml(url, '')
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
      } catch (e: any) {
        vite.ssrFixStacktrace(e)
        console.error(e)
        res.status(500).end(e.message)
      }
    })
  } else {
    // PROD: serve built client
    const clientDist = path.resolve(__dirname, '../../client/dist')
    app.use(express.static(clientDist))
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'))
    })
  }

  app.listen(PORT, HOST, () => {
    console.log(`✅ Server ready on http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV})`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})