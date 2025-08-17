
import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto"
const keyB64 = process.env.DATA_ENCRYPTION_KEY || ""
const key = keyB64 ? Buffer.from(keyB64, "base64url") : Buffer.alloc(32)
const ivlen = 12
export function enc(data: string) { const iv=randomBytes(ivlen); const c=createCipheriv("aes-256-gcm",key,iv); const d=Buffer.concat([c.update(data,"utf8"),c.final()]); const tag=c.getAuthTag(); return Buffer.concat([iv,tag,d]).toString("base64url") }
export function dec(blob: string) { const b=Buffer.from(blob,"base64url"); const iv=b.subarray(0,ivlen); const tag=b.subarray(ivlen,ivlen+16); const d=b.subarray(ivlen+16); const c=createDecipheriv("aes-256-gcm",key,iv); c.setAuthTag(tag); return Buffer.concat([c.update(d),c.final()]).toString("utf8") }
