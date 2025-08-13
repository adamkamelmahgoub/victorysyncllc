
import { randomInt } from 'crypto';
import { sendEmail } from '../lib/email';
import { sendSms } from '../lib/sms';

const cache = new Map<string, {e:string; s:string; exp:number}>();

export function generate(email: string, phone: string) {
  const key = `${email}:${phone}`;
  const e = String(randomInt(100000, 999999));
  const s = String(randomInt(100000, 999999));

  cache.set(key, { e, s, exp: Date.now() + 10 * 60 * 1000 });

  return { key, eCode: e, sCode: s };
}

export async function dispatch(email: string, phone: string, eCode: string, sCode: string) {
  await sendEmail(email, 'Your VictorySync Email Code', `<p>Your code: <b>${eCode}</b></p>`);
  await sendSms(phone, `VictorySync SMS code: ${sCode}`);
}

export function verifyPair(key: string, e: string, s: string) {
  const rec = cache.get(key);
  if (!rec) return false;

  if (Date.now() > rec.exp) {
    cache.delete(key);
    return false;
  }

  const ok = rec.e === e && rec.s === s;
  if (ok) cache.delete(key);

  return ok;
}
