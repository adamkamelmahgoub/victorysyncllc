
export async function api(path: string, init?: RequestInit) {
  return fetch(path, {
    credentials: 'include', // critical for cookies
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
}
