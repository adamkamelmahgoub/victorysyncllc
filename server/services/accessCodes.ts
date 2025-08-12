
import { query } from '../db/index';
import { randomBytes } from 'crypto';

export async function issueAccessCode(adminId: string, data: {
  email: string; phone: string; full_name: string; company_name: string; ttlMinutes?: number;
}) {
  const code = randomBytes(6).toString('hex').toUpperCase(); // 12 chars
  const expires = new Date(Date.now() + (data.ttlMinutes ?? 120)*60*1000);
  await query`
    INSERT INTO access_codes (code, company_name, expires_at, created_by)
    VALUES (${code}, ${data.company_name}, ${expires.toISOString()}, ${adminId})
  `;
  return code;
}

export async function consumeAccessCode(code: string, payload: {
  company_name: string;
}) {
  const rows = await query<any>`
    SELECT * FROM access_codes WHERE code=${code} AND is_active=true AND (expires_at IS NULL OR expires_at>now()) LIMIT 1
  `;
  const ac = rows[0];
  if (!ac) throw new Error('Invalid or expired access code');
  // verify company name match
  if (ac.company_name !== payload.company_name) {
    throw new Error('Access code does not match submitted company');
  }
  return ac;
}

export async function markAccessCodeConsumed(code: string, userId: string) {
  await query`UPDATE access_codes SET usage_count = usage_count + 1, updated_at = now() WHERE code=${code}`;
  await query`INSERT INTO user_registrations (user_id, access_code_id, company_name) 
              SELECT ${userId}, id, company_name FROM access_codes WHERE code=${code}`;
}
