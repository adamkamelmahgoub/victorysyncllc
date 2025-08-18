
import { Router } from 'express';
import { requireAuth } from '../services/auth.js';
import { enqueueSync } from '../../worker/index.js';
const r = Router();
r.use(requireAuth);
r.get('/available', (_req,res)=> res.json([{key:'hubspot',type:'crm'},{key:'twilio',type:'dialer'}]));
r.get('/', (_req,res)=> res.json([]));
r.post('/connect', async (req,res)=>{ res.json({ ok:true, provider:req.body.key }); });
r.delete('/:id', async (_req,res)=> res.json({ ok:true }));
r.post('/:id/sync', async (req,res)=>{ await enqueueSync('sync-provider', { id:req.params.id }); res.json({ ok:true }); });
r.post('/hooks/:provider', async (req,res)=> res.json({ ok:true }));
export default r;
