export type HttpMethod = "GET"|"POST"|"PATCH"|"DELETE";
export async function apiRequest<T>(url: string, opts: { method?: HttpMethod; body?: any; token?: string } = {}): Promise<T> {
  const res = await fetch(url, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {})
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(()=> ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data as T;
}