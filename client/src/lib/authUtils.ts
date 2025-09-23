
export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export async function fetchMe(): Promise<{ ok: true; user: any } | null> {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include", // IMPORTANT for cookies
    });

    // Do not throw on 401 here — return a defined value
    if (res.status === 401) return null;

    if (!res.ok) {
      // Only throw for unexpected server errors
      const text = await res.text().catch(() => "");
      throw new Error(`ME request failed: ${res.status} ${text}`);
    }

    // Always return something defined
    const data = await res.json();
    return data?.ok ? data : null;
  } catch (error) {
    console.error("fetchMe error:", error);
    return null;
  }
}
