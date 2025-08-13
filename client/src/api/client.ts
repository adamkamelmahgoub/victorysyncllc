export async function api(path: string, init?: RequestInit) {
  const res = await fetch(path.startsWith('/api') ? path : `/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init
  });
  if (!res.ok) {
    throw new Error((await res.json().catch(() => ({ message: res.statusText }))).message);
  }
  return res.json();
}