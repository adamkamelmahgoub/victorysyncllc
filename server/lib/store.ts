
import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), ".data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

function load<T>(file: string, init: T): T {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(init, null, 2));
    return init;
  }
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
  } catch {
    return init;
  }
}
function save<T>(file: string, data: T) {
  const p = path.join(DATA_DIR, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

// Access codes
export type AccessCode = {
  code: string;
  email?: string;
  org?: string;
  role?: "superAdmin"|"admin"|"manager"|"agent"|"customer";
  maxUses: number;
  usedCount: number;
  expiresAt?: string;
  createdAt: string;
  isActive: boolean;
};
type AccessState = { codes: AccessCode[] };
const accessFile = "access-codes.json";
export const AccessStore = {
  list(): AccessCode[] { return load<AccessState>(accessFile,{codes:[]}).codes; },
  upsert(ac: AccessCode) {
    const state = load<AccessState>(accessFile, {codes:[]});
    const idx = state.codes.findIndex(c => c.code === ac.code);
    if (idx >= 0) state.codes[idx] = ac; else state.codes.push(ac);
    save(accessFile, state);
  },
  get(code: string) { return AccessStore.list().find(c => c.code === code) || null; }
};

// Users (file-backed demo; in prod use DB)
export type User = {
  id: string;
  email: string;
  role: "superAdmin"|"admin"|"manager"|"agent"|"customer";
  org?: string;
  passwordHash: string;
  twoFAEnabled?: boolean;
  createdAt: string;
};
type UserState = { users: User[] };
const userFile = "users.json";
export const UserStore = {
  list(): User[] { return load<UserState>(userFile,{users:[]}).users; },
  byEmail(email: string) { return UserStore.list().find(u => u.email.toLowerCase()===email.toLowerCase()) || null; },
  upsert(u: User) {
    const state = load<UserState>(userFile, {users:[]});
    const idx = state.users.findIndex(x => x.email.toLowerCase()===u.email.toLowerCase());
    if (idx >= 0) state.users[idx] = u; else state.users.push(u);
    save(userFile, state);
  }
};

// Password reset tokens
export type ResetToken = {
  id: string;
  email: string;
  isAdmin: boolean;
  otp: string;
  createdAt: string;
  verifiedAt?: string;
};
type ResetState = { tokens: ResetToken[] };
const resetFile = "password-resets.json";
export const ResetStore = {
  list(): ResetToken[] { return load<ResetState>(resetFile,{tokens:[]}).tokens; },
  get(id: string) { return ResetStore.list().find(t => t.id===id) || null; },
  upsert(t: ResetToken) {
    const state = load<ResetState>(resetFile, {tokens:[]});
    const idx = state.tokens.findIndex(x=>x.id===t.id);
    if (idx>=0) state.tokens[idx]=t; else state.tokens.push(t);
    save(resetFile, state);
  }
};
