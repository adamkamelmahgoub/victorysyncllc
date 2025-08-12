
import { randomInt } from 'crypto';
import { sendEmail } from '../lib/email';
import { sendSms } from '../lib/sms';

const cache = new Map<string,{email:string;phone:string; codeEmail:string; codeSms:string; expires:number}>();

export function generateOtps(key:string, email:string, phone:string) {
  const codeEmail = String(randomInt(100000,999999));
  const codeSms   = String(randomInt(100000,999999));
  cache.set(key, { email, phone, codeEmail, codeSms, expires: Date.now()+10*60*1000 });
  return { codeEmail, codeSms };
}

export async function sendOtps(email:string, phone:string, ce:string, cs:string) {
  await sendEmail(email, 'Your VictorySync Email Code', `<p>Your code: <b>${ce}</b></p>`);
  await sendSms(phone, `Your VictorySync SMS code: ${cs}`);
}

export function verifyOtps(key:string, emailCode:string, smsCode:string) {
  const rec = cache.get(key); 
  if (!rec) return false;
  if (Date.now()>rec.expires) { 
    cache.delete(key); 
    return false; 
  }
  const ok = rec.codeEmail===emailCode && rec.codeSms===smsCode;
  if (ok) cache.delete(key);
  return ok;
}
