
export async function api<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api${url}`, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    if (!location.pathname.startsWith('/login')) {
      sessionStorage.setItem('postLoginRedirect', location.pathname + location.search);
      location.assign('/login');
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? await res.json() as T : (undefined as T);
}
