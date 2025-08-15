
// Centralized fetch that never hard-crashes the app
const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { credentials: "include" }).catch(() => null);
  if (!res || !res.ok) throw new Error(`GET ${url} failed`);
  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body)
  }).catch(() => null);
  if (!res || !res.ok) throw new Error(`POST ${url} failed`);
  return (await res.json()) as T;
}
