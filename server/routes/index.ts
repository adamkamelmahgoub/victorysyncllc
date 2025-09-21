
import { Router } from 'express'
import authRouter from './auth'

const router = Router()

// Health check
router.get('/health', (_req, res) => res.json({ ok: true }))

// Auth routes
router.use('/auth', authRouter)

export default router
