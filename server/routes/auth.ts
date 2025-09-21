import { Router } from 'express'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'

const authRouter = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const COOKIE_NAME = 'vs_session'

// Demo user validation
function validateCredentials(email: string, password: string) {
  return (
    (email === 'demo@victorysync.com' && password === 'VictoryScale123!') ||
    (email === 'admin@victorysync.com' && password === 'VictoryScale123!')
  )
}

// Demo user data
function getUserData(email: string) {
  return {
    id: 1,
    email,
    role: 'super_admin',
    orgId: 'demo-scale'
  }
}

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  if (!validateCredentials(email, password)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const user = getUserData(email)
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })

  res.json({ ok: true })
})

// GET /api/auth/me
authRouter.get('/me', (req: Request, res: Response) => {
  const token = req.cookies[COOKIE_NAME]

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      orgId: decoded.orgId
    }
    res.json({ user })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

// POST /api/auth/logout
authRouter.post('/logout', (req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: '/' })
  res.json({ ok: true })
})

export default authRouter