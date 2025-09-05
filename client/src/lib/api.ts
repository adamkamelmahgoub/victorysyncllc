
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const API_BASE = "/api";

export async function apiRequest<T = any>(method: HttpMethod, path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error || `Request failed: ${res.status}`);
  }
  return (await safeJson(res)) as T;
}

async function safeJson(res: Response) {
  try { return await res.json(); } catch { return null; }
}
