
import { query } from '../db';
import bcrypt from 'bcrypt';

export async function findUserByEmail(email: string) {
  const result = await query<any>`SELECT * FROM users WHERE email=${email} LIMIT 1`;
  return result[0];
}

export async function createOrgIfNeeded(name: string) {
  const existing = await query<any>`SELECT id FROM organizations WHERE name=${name} LIMIT 1`;
  if (existing[0]) return existing[0].id;
  
  const inserted = await query<any>`INSERT INTO organizations(name) VALUES(${name}) RETURNING id`;
  return inserted[0].id;
}

export async function createUser(data: {
  org_id: string;
  email: string;
  phone: string;
  full_name: string;
  role: string;
  password: string;
}) {
  const hash = await bcrypt.hash(data.password, 12);
  
  const inserted = await query<any>`
    INSERT INTO users (org_id, email, phone, full_name, role, password_hash)
    VALUES (${data.org_id}, ${data.email}, ${data.phone}, ${data.full_name}, ${data.role}, ${hash})
    RETURNING id, email, role, org_id, full_name, phone;
  `;
  
  await query`INSERT INTO user_permissions(user_id) VALUES(${inserted[0].id})`;
  await query`INSERT INTO user_payment_policies(user_id) VALUES(${inserted[0].id})`;
  
  return inserted[0];
}

export async function verifyPassword(user: any, password: string) {
  return bcrypt.compare(password, user.password_hash);
}

export async function setVerificationFlags(id: string, flags: { email?: boolean; phone?: boolean }) {
  if (flags.email !== undefined) {
    await query`UPDATE users SET email_verified=${flags.email} WHERE id=${id}`;
  }
  if (flags.phone !== undefined) {
    await query`UPDATE users SET phone_verified=${flags.phone} WHERE id=${id}`;
  }
}
