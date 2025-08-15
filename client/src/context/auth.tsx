
import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";

type User = { id?: string; email?: string; name?: string } | null;
type AuthCtx = {
  user: User; authenticated: boolean; loading: boolean; error?: string;
  refresh: () => void; login: () => Promise<void>; logout: () => Promise<void>;
};
const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User>(null);
  const [authenticated, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/check", { credentials: "include" });
      const data = (await res.json().catch(() => ({}))) as any;
      setUser(data?.user ?? null); setAuthed(!!data?.authenticated); setError(undefined);
    } catch (e: any) { setUser(null); setAuthed(false); setError(String(e?.message||e)); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  return (
    <AuthContext.Provider value={{ user, authenticated, loading, error, refresh: load, login: async()=>{}, logout: async()=>{} }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    console.warn("useAuth called without AuthProvider — returning safe defaults.");
    return { user:null, authenticated:false, loading:false, error:"AuthProvider missing", refresh:()=>{}, login:async()=>{}, logout:async()=>{} };
  }
  return ctx;
}
