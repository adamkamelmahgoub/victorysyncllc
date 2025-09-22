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

// Serve static assets from built client
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST))
}

// Serve SPA if built, otherwise helpful message
app.get('*', (req, res, next) => {
  // Permit /api/* to be handled by API routes
  if (req.path.startsWith('/api/')) return next()

  if (fs.existsSync(INDEX_HTML)) {
    return res.sendFile(INDEX_HTML)
  } else {
    res
      .status(200)
      .type('html')
      .send(
        `VictorySync API is running.<br/>Build the frontend to serve the SPA (see scripts below).<br/>Dev frontend available at <a href="${FRONTEND_URL}">${FRONTEND_URL}</a>.`
      )
  }
})

app.listen(PORT, '0.0.0.0', () => {
  if (fs.existsSync(INDEX_HTML)) {
    console.log('Serving built SPA')
  } else {
    console.log(`No built SPA found at ${INDEX_HTML}. Serving API only. FRONTEND_URL=${FRONTEND_URL}`)
  }
  console.log(`VictorySync API running on :${PORT}`)
})