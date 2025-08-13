
import { query } from '../db';
import { randomBytes } from 'crypto';

export async function issueAccessCode(adminId: string, data: {
  email: string;
  phone: string;
  full_name: string;
  org_name: string;
  ttlMinutes?: number;
}) {
  const code = randomBytes(6).toString('hex').toUpperCase();
  const expires = new Date(Date.now() + (data.ttlMinutes ?? 120) * 60_000);
  
  await query`
    INSERT INTO access_codes(code, issued_to_email, issued_to_phone, issued_to_full_name, issued_to_org_name, expires_at, created_by)
    VALUES(${code}, ${data.email}, ${data.phone}, ${data.full_name}, ${data.org_name}, ${expires.toISOString()}, ${adminId})
  `;
  
  return code;
}

export async function validateAccessCode(code: string, params: {
  email: string;
  phone: string;
  full_name: string;
  org_name: string;
}) {
  const rows = await query<any>`SELECT * FROM access_codes WHERE code=${code} AND consumed=false AND expires_at>now() LIMIT 1`;
  const accessCode = rows[0];
  
  if (!accessCode) {
    throw new Error('Invalid or expired access code');
  }
  
  if (accessCode.issued_to_email !== params.email || 
      accessCode.issued_to_phone !== params.phone || 
      accessCode.issued_to_full_name !== params.full_name || 
      accessCode.issued_to_org_name !== params.org_name) {
    throw new Error('Access code does not match submitted identity');
  }
  
  return accessCode;
}

export async function markConsumed(code: string, userId: string) {
  await query`UPDATE access_codes SET consumed=true, consumed_by=${userId} WHERE code=${code}`;
}
