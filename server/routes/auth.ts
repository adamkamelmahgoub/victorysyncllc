
import { Router } from 'express';
import { sql } from '../db/index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';

const router = Router();

router.post('/signup-with-code', async (req, res) => {
  try {
    const { email, password, accessCode } = req.body;
    if (process.env.ACCESS_CODE_SIGNUP !== 'ENABLED') return res.status(403).json({message:'disabled'});
    const [code] = await sql`SELECT * FROM access_codes WHERE code=${accessCode}`;
    if (!code) return res.status(400).json({message:'invalid code'});
    if (code.expires_at && new Date(code.expires_at) < new Date()) return res.status(400).json({message:'expired'});
    if (code.max_uses && code.used >= code.max_uses) return res.status(400).json({message:'max uses reached'});

    const hash = await bcrypt.hash(password, 10);
    const [u] = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${hash})
      ON CONFLICT (email) DO NOTHING
      RETURNING id,email,role,is_active,twofa_enabled
    `;
    if (!u) return res.status(409).json({message:'email exists'});

    await sql`UPDATE access_codes SET used=used+1 WHERE code=${accessCode}`;

    const token = jwt.sign({ sub: u.id, role: u.role }, process.env.JWT_SECRET!, { expiresIn: '12h' });
    res.json({ token, user: u });
  } catch (e) {
    console.error(e);
    res.status(500).json({message:'signup failed'});
  }
});

router.post('/login', async (req, res) => {
  const { email, password, otp } = req.body;
  const [u] = await sql`SELECT * FROM users WHERE email=${email}`;
  if (!u) return res.status(401).json({message:'bad creds'});
  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return res.status(401).json({message:'bad creds'});

  if (u.twofa_enabled) {
    if (!otp || !u.twofa_secret || !authenticator.check(otp, u.twofa_secret)) {
      return res.status(401).json({message:'otp required or invalid'});
    }
  }
  const token = jwt.sign({ sub: u.id, role: u.role }, process.env.JWT_SECRET!, { expiresIn: '12h' });
  res.json({ token, user: { id: u.id, email: u.email, role: u.role, twofa_enabled: u.twofa_enabled } });
});

router.post('/2fa/setup', async (req, res) => {
  const userId = (req as any).user?.sub; // assume auth middleware sets this
  if (!userId) return res.status(401).end();
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri('VictorySync', 'VictorySync', secret);
  await sql`UPDATE users SET twofa_secret=${secret}, twofa_enabled=true WHERE id=${userId}`;
  res.json({ otpauth });
});

export default router;
