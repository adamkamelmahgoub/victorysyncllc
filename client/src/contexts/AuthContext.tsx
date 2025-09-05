
import { createContext, useContext, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";

type User = { email: string; role: string };
type AuthValue = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const value = useMemo<AuthValue>(() => ({
    isAuthenticated: !!user,
    user,
    loading,
    async login(email, password) {
      setLoading(true);
      try {
        const r = await apiRequest<{ user: User }>("POST", "/auth/login", { email, password });
        setUser(r.user);
      } finally { setLoading(false); }
    },
    async register(email, password) {
      setLoading(true);
      try {
        await apiRequest("POST", "/auth/register", { email, password });
      } finally { setLoading(false); }
    },
    async logout() {
      await apiRequest("POST", "/auth/logout");
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
