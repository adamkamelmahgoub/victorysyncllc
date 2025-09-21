
export async function api(endpoint: string, options: RequestInit = {}): Promise<any> {
  const response = await fetch(`/api${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `HTTP ${response.status}`)
  }

  return response.json()
}

export const apiPost = (endpoint: string, data: any) =>
  api(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const apiGet = (endpoint: string) => api(endpoint)
