
import express from 'express'
import path from 'path'
import fs from 'fs'
import routes from './routes'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// Trust proxy for secure cookies behind Replit's HTTPS proxy
app.set('trust proxy', 1)

// Core middleware
app.use(express.json())
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(cookieParser())

// Mount your API routes under /api
app.use('/api', routes)

// ------- Frontend serving (robust) -------
const ROOT_DIR = path.join(__dirname, '..') // compiled server folder root
const DIST_DIR = path.join(ROOT_DIR, 'client', 'dist')
const DIST_INDEX = path.join(DIST_DIR, 'index.html')

const FRONTEND_DEV_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// If we have a built SPA, serve it. Otherwise, show a friendly message and DO NOT crash.
if (fs.existsSync(DIST_INDEX)) {
  // Serve static assets
  app.use(express.static(DIST_DIR))
  // SPA fallback
  app.get('*', (_req, res) => res.sendFile(DIST_INDEX))
  console.log(`[web] Serving built SPA from ${DIST_DIR}`)
} else {
  app.get('/', (_req, res) => {
    res
      .status(200)
      .send(
        `VictorySync API is running.<br/>Build the frontend to serve the SPA (see scripts below).<br/>Dev frontend available at <a href="${FRONTEND_DEV_URL}">${FRONTEND_DEV_URL}</a>.`
      )
  })
  console.warn(
    `[web] No built SPA found at ${DIST_INDEX}. Serving API only. FRONTEND_URL=${FRONTEND_DEV_URL}`
  )
}

// ------- Start server -------
const PORT = Number(process.env.PORT || 5000)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`VictorySync API running on :${PORT}`)
})
