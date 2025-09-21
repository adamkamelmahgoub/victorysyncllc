
// Build + run
// 1) npm run build:client
// 2) npm run start

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import authRouter from './routes/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Trust proxy for secure cookies behind Replit's HTTPS proxy
app.set('trust proxy', 1)

// Core middleware
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true })
})

// API routes
app.use('/api/auth', authRouter)

// Static serving for built client
const CLIENT_DIST = path.join(__dirname, '../client/dist')
app.use(express.static(CLIENT_DIST))

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next()
  }
  res.sendFile(path.join(CLIENT_DIST, 'index.html'))
})

const PORT = Number(process.env.PORT || 5000)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`VictorySync API running on :${PORT}`)
})
