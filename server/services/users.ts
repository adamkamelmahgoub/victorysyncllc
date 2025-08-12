
import { query } from '../db/index';
import bcrypt from 'bcrypt';

export async function findUserByEmail(email: string) {
  const r = await query<any>`SELECT * FROM users WHERE email=${email} LIMIT 1`; 
  return r[0];
}

export async function createOrgIfNeeded(name: string) {
  const existing = await query<any>`SELECT id FROM organizations WHERE name=${name} LIMIT 1`;
  if (existing[0]) return existing[0].id;
  const ins = await query<any>`INSERT INTO organizations (name) VALUES (${name}) RETURNING id`; 
  return ins[0].id;
}

export async function createUser(data: {
  org_id: string; email: string; phone: string; full_name: string; role: string; password: string;
}) {
  const hash = await bcrypt.hash(data.password, 12);
  const ins = await query<any>`
    INSERT INTO users (org_id,email,phone,full_name,role,password_hash)
    VALUES (${data.org_id}, ${data.email}, ${data.phone}, ${data.full_name}, ${data.role}, ${hash})
    RETURNING id, email, role, org_id, full_name, phone;
  `;
  // default permissions + payment policy
  await query`INSERT INTO user_permissions (user_id) VALUES (${ins[0].id})`;
  await query`INSERT INTO user_payment_policies (user_id) VALUES (${ins[0].id})`;
  return ins[0];
}

export async function verifyPassword(user: any, pwd: string) {
  return bcrypt.compare(pwd, user.password_hash);
}

export async function setVerificationFlags(userId: string, {email, phone}:{email?:boolean; phone?:boolean}) {
  if (email !== undefined) await query`UPDATE users SET email_verified=${email} WHERE id=${userId}`;
  if (phone !== undefined) await query`UPDATE users SET phone_verified=${phone} WHERE id=${userId}`;
}
