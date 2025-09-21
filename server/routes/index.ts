
// server/routes/index.ts
import { Router } from 'express'

// Import sub-routers
import authRouter from './auth'

const router = Router()

// Example health route (keep this even if I add others)
router.get('/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() })
})

// Mount sub-routers
router.use('/auth', authRouter)

export default router
