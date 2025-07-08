import { QueryClient, QueryFunction } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};

    if (data) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${url}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API request failed: ${method} ${url}`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}${queryKey[0]}`, {
        headers,
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        // Token is invalid, remove it
        if (token) {
          localStorage.removeItem('auth_token');
        }
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error(`Query failed: ${queryKey[0]}`, error);
      throw error;
    }
  };

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error) => {
          // Don't retry on 401, 404, or 403 errors
          if (error instanceof Error && (error.message.includes('401') || error.message.includes('404') || error.message.includes('403'))) return false;
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        queryFn: async ({ queryKey }) => {
          try {
            const url = queryKey[0] as string;
            const token = localStorage.getItem('auth_token');
            const headers: Record<string, string> = {};

            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
              headers,
              credentials: "include",
            });

            if (!response.ok) {
              if (response.status === 401 && token) {
                // Token is invalid, remove it
                localStorage.removeItem('auth_token');
              }
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return response.json();
          } catch (error) {
            console.error(`Query failed: ${queryKey[0]}`, error);
            throw error;
          }
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 1; // Reduce retry attempts further
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      throwOnError: false, // Prevent unhandled promise rejections
      onError: (error) => {
        console.error("Query failed:", error);
      },
    },
    mutations: {
      throwOnError: false, // Prevent unhandled promise rejections
      onError: (error) => {
        console.error("Mutation failed:", error);
      },
    },
  },
});

// Add global unhandled rejection handler
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent default browser behavior
  });
}