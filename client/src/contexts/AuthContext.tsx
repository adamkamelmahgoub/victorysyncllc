
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = { id: string; email: string };
type Ctx = { user: User | null; login: (email: string, password: string) => Promise<void>; logout: () => void; isAuthenticated: boolean; };
const AuthContext = createContext<Ctx | undefined>(undefined);
const KEY = "vs_auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(KEY);
    if (token) try { setUser(JSON.parse(token)); } catch { localStorage.removeItem(KEY); }
  }, []);

  async function login(email: string, password: string) {
    // Try server first (if you later add /api/auth/login it will just work)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json(); // expect { user }
        setUser(data.user); localStorage.setItem(KEY, JSON.stringify(data.user)); return;
      }
    } catch {}
    // Fallback local demo login
    const fake = { id: "dev", email };
    setUser(fake); localStorage.setItem(KEY, JSON.stringify(fake));
  }
  function logout() { setUser(null); localStorage.removeItem(KEY); }
  const value = useMemo(() => ({ user, login, logout, isAuthenticated: !!user }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const v = useContext(AuthContext); if (!v) throw new Error("useAuth must be used within AuthProvider"); return v; }
