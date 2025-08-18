
import { Router } from 'express';
import { db } from '../db/client.js';
import { users, organizations, socialAccounts } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { googleToken, googleProfile, msToken, msProfile } from '../services/oauth.js';
import { signSession, setAuthCookie } from '../services/auth.js';

const r = Router();
function base(){ return process.env.OAUTH_REDIRECT_BASE || 'http://0.0.0.0:5000'; }

r.get('/google', (req,res)=>{ const state = encodeURIComponent(req.query.state as string || ''); const redirect=`https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
  client_id: process.env.GOOGLE_CLIENT_ID!, redirect_uri: `${base()}/api/oauth/google/callback`, response_type:'code', scope:'openid email profile', state
})}`; res.redirect(redirect); });

r.get('/google/callback', async (req,res,next)=>{ try{
  const code=String(req.query.code||''); const state=String(req.query.state||'');
  const t=await googleToken(code, `${base()}/api/oauth/google/callback`); const prof=await googleProfile(t.access_token);
  let u=(await db.select().from(users).where(eq(users.email, String(prof.email||'').toLowerCase())))[0];
  // if user doesn't exist, require invite/accessCode in state to allow signup
  if(!u){
    const params=new URLSearchParams(state);
    const accessCode=params.get('accessCode'); const orgIdCode=params.get('orgIdCode'); const orgName=params.get('organizationName');
    if(!(accessCode && orgIdCode && orgName)) return res.status(400).send('Missing onboarding state (accessCode/org)');
    // … you can reuse /auth/register internal logic here if desired …
    return res.status(501).send('Auto-provision via SSO + access code not fully wired in this snippet.');
  }
  const token=signSession(u); setAuthCookie(res, token);
  res.redirect('/');
}catch(e){ next(e);} });

r.get('/microsoft', (req,res)=>{ const state=encodeURIComponent(req.query.state as string || ''); const redirect=`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${new URLSearchParams({
  client_id: process.env.MICROSOFT_CLIENT_ID!, response_type:'code', redirect_uri:`${base()}/api/oauth/microsoft/callback`,
  scope:'openid email profile', state
})}`; res.redirect(redirect); });

r.get('/microsoft/callback', async (req,res,next)=>{ try{
  const code=String(req.query.code||''); const t=await msToken(code, `${base()}/api/oauth/microsoft/callback`); const prof=await msProfile(t.access_token);
  let u=(await db.select().from(users).where(eq(users.email, String(prof.mail||prof.userPrincipalName||'').toLowerCase())))[0];
  if(!u) return res.status(501).send('Auto-provision via SSO not fully wired in this snippet.');
  const token=signSession(u); setAuthCookie(res, token); res.redirect('/');
}catch(e){ next(e);} });

export default r;
