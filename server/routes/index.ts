
import { Router } from 'express'
import auth from './auth'

const router = Router()
router.use('/auth', auth)

router.get('/health', (_req, res) => res.json({ ok: true }))

export default router
