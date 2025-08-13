
export function getToken() {
  try {
    return localStorage.getItem('vs_token') || '';
  } catch {
    return '';
  }
}

export async function api(path: string, init?: RequestInit) {
  const token = getToken();
  const res = await fetch(path.startsWith('/api') ? path : `/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {})
    },
    ...init,
    credentials: 'include' // harmless with Bearer; keeps dev flexibility
  });
  
  if (!res.ok) {
    throw new Error((await res.json().catch(() => ({ message: res.statusText }))).message);
  }
  
  return res.json();
}
