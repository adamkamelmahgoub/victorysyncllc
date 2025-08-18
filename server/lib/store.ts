
import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), ".data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

function load<T>(file: string, init: T): T {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) { fs.writeFileSync(p, JSON.stringify(init, null, 2)); return init; }
  try { return JSON.parse(fs.readFileSync(p, "utf-8")) as T; } catch { return init; }
}
function save<T>(file: string, data: T) {
  const p = path.join(DATA_DIR, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

export type AccessCode = {
  code: string; email?: string; org?: string;
  role?: "superAdmin"|"admin"|"manager"|"agent"|"customer";
  maxUses: number; usedCount: number;
  expiresAt?: string; createdAt: string; isActive: boolean;
};
type AccessState = { codes: AccessCode[] };
const accessFile = "access-codes.json";
export const AccessStore = {
  list(): AccessCode[] { return load<AccessState>(accessFile,{codes:[]}).codes; },
  get(code: string) { return AccessStore.list().find(c=>c.code===code)||null; },
  upsert(ac: AccessCode) { const s=load<AccessState>(accessFile,{codes:[]}); const i=s.codes.findIndex(c=>c.code===ac.code); if(i>=0)s.codes[i]=ac; else s.codes.push(ac); save(accessFile,s); }
};

export type User = {
  id: string; email: string; role: "superAdmin"|"admin"|"manager"|"agent"|"customer";
  org?: string; passwordHash: string; twoFAEnabled?: boolean; createdAt: string;
};
type UserState = { users: User[] };
const userFile = "users.json";
export const UserStore = {
  list(): User[] { return load<UserState>(userFile,{users:[]}).users; },
  byEmail(email: string) { return UserStore.list().find(u=>u.email.toLowerCase()===email.toLowerCase())||null; },
  byId(id: string) { return UserStore.list().find(u=>u.id===id)||null; },
  upsert(u: User){ const s=load<UserState>(userFile,{users:[]}); const i=s.users.findIndex(x=>x.id===u.id||x.email.toLowerCase()===u.email.toLowerCase()); if(i>=0)s.users[i]=u; else s.users.push(u); save(userFile,s); }
};

export type ResetToken = { id: string; email: string; isAdmin: boolean; otp: string; createdAt: string; verifiedAt?: string; };
type ResetState = { tokens: ResetToken[] };
const resetFile = "password-resets.json";
export const ResetStore = {
  list(): ResetToken[] { return load<ResetState>(resetFile,{tokens:[]}).tokens; },
  get(id: string){ return ResetStore.list().find(t=>t.id===id)||null; },
  upsert(t: ResetToken){ const s=load<ResetState>(resetFile,{tokens:[]}); const i=s.tokens.findIndex(x=>x.id===t.id); if(i>=0)s.tokens[i]=t; else s.tokens.push(t); save(resetFile,s); }
};
