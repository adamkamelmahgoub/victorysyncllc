
type HttpMethod = "GET"|"POST"|"PUT"|"PATCH"|"DELETE";

export class ApiError extends Error {
  status: number; 
  data?: unknown;
  
  constructor(message: string, status: number, data?: unknown) { 
    super(message); 
    this.status = status; 
    this.data = data; 
  }
}

async function request<T>(method: HttpMethod, url: string, body?: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { 
      "Content-Type": "application/json", 
      ...(init?.headers || {}) 
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });
  
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  
  if (!res.ok) {
    throw new ApiError(
      typeof data === "string" ? data : (data?.error || "Request failed"), 
      res.status, 
      data
    );
  }
  
  return data as T;
}

export const api = {
  get:   <T>(url: string, init?: RequestInit) => request<T>("GET", url, undefined, init),
  post:  <T>(url: string, body?: unknown, init?: RequestInit) => request<T>("POST", url, body, init),
  put:   <T>(url: string, body?: unknown, init?: RequestInit) => request<T>("PUT", url, body, init),
  patch: <T>(url: string, body?: unknown, init?: RequestInit) => request<T>("PATCH", url, body, init),
  del:   <T>(url: string, init?: RequestInit) => request<T>("DELETE", url, undefined, init),
};
