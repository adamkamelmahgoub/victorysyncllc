
export async function apiRequest<T = any>(method: string, url: string, body?: any): Promise<T> {
  const token = localStorage.getItem('vs_token');
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });
  if (res.status === 401) throw new Error('Unauthenticated');
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
