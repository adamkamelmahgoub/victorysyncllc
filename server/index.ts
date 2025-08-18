
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { createServer as createViteServer, ViteDevServer } from 'vite'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProd = process.env.NODE_ENV === 'production'
const PORT = Number(process.env.PORT || 5000)

async function createApp() {
  const app = express()

  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())
  app.use(cors({ origin: true, credentials: true }))

  // Health check
  app.get('/health', (_req, res) => res.json({ ok: true }))

  // ===== API routes =====
  try {
    const { authRouter } = await import('./routes/auth.js')
    const { adminRouter } = await import('./routes/admin.js')
    const { billingRouter } = await import('./routes/billing.js')
    const { passwordRouter } = await import('./routes/password.js')
    const { oauthRouter } = await import('./routes/oauth.js')
    const { integrationsRouter } = await import('./routes/integrations.js')
    const { exportsRouter } = await import('./routes/exports.js')
    const { webhooksRouter } = await import('./routes/webhooks.js')
    
    app.use('/api/auth', authRouter)
    app.use('/api/admin', adminRouter)
    app.use('/api/billing', billingRouter)
    app.use('/api/password', passwordRouter)
    app.use('/api/oauth', oauthRouter)
    app.use('/api/integrations', integrationsRouter)
    app.use('/api/exports', exportsRouter)
    app.use('/api/webhooks', webhooksRouter)
  } catch (error) {
    console.log('Some route modules not found, continuing...')
  }

  if (!isProd) {
    // ----- DEV: Vite middleware -----
    const vite: ViteDevServer = await createViteServer({
      server: { middlewareMode: true, hmr: { clientPort: 443 }, host: true },
      appType: 'custom',
    })

    app.use(vite.middlewares)

    // SPA fallback to client index.html via Vite
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api/')) return next()
      try {
        const url = req.originalUrl
        let template = fs.readFileSync(path.resolve(__dirname, '../client/index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
      } catch (e) {
        vite.ssrFixStacktrace(e as Error)
        next(e)
      }
    })
  } else {
    // ----- PROD: serve built static -----
    const distDir = path.resolve(__dirname, '../client/dist')
    const clientIndex = path.join(distDir, 'index.html')

    app.use(express.static(distDir, { index: false }))

    // SPA fallback for non-API routes
    app.get('*', (req, res, next) => {
      if (req.originalUrl.startsWith('/api/')) return next()
      res.sendFile(clientIndex)
    })
  }

  return app
}

createApp()
  .then((app) => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[express] listening on :${PORT} (isProd=${isProd})`)
    })
  })
  .catch((err) => {
    console.error('Fatal boot error:', err)
    process.exit(1)
  })
