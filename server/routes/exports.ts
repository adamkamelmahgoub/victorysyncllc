
import { Router } from 'express';
import { requireAuth } from '../services/auth.js';
import { stringify } from 'csv-stringify/sync';
const r = Router();
r.use(requireAuth);
r.get('/csv', async (_req,res)=>{ const rows=[{a:1,b:2},{a:3,b:4}]; const csv=stringify(rows,{header:true}); res.setHeader('Content-Type','text/csv'); res.setHeader('Content-Disposition','attachment; filename="export.csv"'); res.send(csv); });
export default r;
