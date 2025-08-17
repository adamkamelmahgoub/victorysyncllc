
import crypto from "crypto";

const ALGO = "aes-256-gcm";

// MFA_ENC_KEY must be 32 bytes (64 hex chars). For dev, you can set a random 64-hex string.
const KEY_HEX = process.env.MFA_ENC_KEY || "".padEnd(64, "0");
const KEY = Buffer.from(KEY_HEX, "hex");

export function encrypt(text: string): string {
  if (!KEY || KEY.length !== 32) throw new Error("MFA_ENC_KEY must be 32 bytes hex (64 chars)");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}.${tag.toString("hex")}.${enc.toString("hex")}`;
}

export function decrypt(payload: string): string {
  if (!KEY || KEY.length !== 32) throw new Error("MFA_ENC_KEY must be 32 bytes hex (64 chars)");
  const [ivHex, tagHex, dataHex] = payload.split(".");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const data = Buffer.from(dataHex, "hex");
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString("utf8");
}
