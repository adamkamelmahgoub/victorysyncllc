
import type { Request, Response } from 'express'
import { Router } from 'express'
import jwt from 'jsonwebtoken'

// In-memory demo user for now — you can swap to DB users easily
const DEMO_USER = { id: 1, email: 'demo@victorysync.com', password: 'VictoryScale123!' }

const router = Router()

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body || {}
  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    return res.status(401).json({ error: 'invalid' })
  }
  const token = jwt.sign({ sub: DEMO_USER.id }, process.env.JWT_SECRET!, { expiresIn: '1d' })
  res.cookie('vsid', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set true when behind https
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  })
  return res.json({ ok: true })
})

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('vsid', { path: '/' })
  res.json({ ok: true })
})

router.get('/me', (req: Request, res: Response) => {
  const raw = req.cookies?.vsid
  if (!raw) return res.status(401).json({ ok: false })
  try {
    const decoded = jwt.verify(raw, process.env.JWT_SECRET!) as { sub: number }
    if (decoded?.sub !== DEMO_USER.id) return res.status(401).json({ ok: false })
    return res.json({ id: DEMO_USER.id, email: DEMO_USER.email })
  } catch {
    return res.status(401).json({ ok: false })
  }
})

export default router
