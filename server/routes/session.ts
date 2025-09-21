
import { Router } from 'express';

export const sessionRouter = Router();

// GET /api/session/me - get current session info
sessionRouter.get('/me', async (req, res) => {
  const auth = (req as any).auth;
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.json({
    user: {
      id: auth.userId,
      orgId: auth.orgId,
      role: auth.role
    }
  });
});
