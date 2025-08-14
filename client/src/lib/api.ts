
export type HttpMethod = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';

export async function apiRequest<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  init?: RequestInit
): Promise<T> {
  const url = path.startsWith('/api') ? path : `/api${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...init,
  });

  if (res.status === 401) {
    // Don't replace DOM with raw JSON — let pages handle auth redirect
    const err = new Error('UNAUTHENTICATED');
    (err as any).status = 401;
    throw err;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(text || `HTTP ${res.status}`);
    (err as any).status = res.status;
    throw err;
  }

  // 204 no content
  if (res.status === 204) return undefined as T;

  const ctype = res.headers.get('content-type') || '';
  if (ctype.includes('application/json')) {
    return (await res.json()) as T;
  }
  // Fallback to text if backend returns text
  return (await res.text()) as unknown as T;
}
