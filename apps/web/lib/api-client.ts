const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787'

export const apiClient = {
  get: (path: string, init?: RequestInit) =>
    fetch(`${API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    }),
  post: (path: string, body?: unknown, init?: RequestInit) =>
    fetch(`${API_URL}${path}`, {
      ...init,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),
	patch: (path: string, body?: unknown, init?: RequestInit) =>
		fetch(`${API_URL}${path}`, {
			...init,
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...init?.headers,
			},
			body: body ? JSON.stringify(body) : undefined,
		}),
	delete: (path: string, init?: RequestInit) =>
		fetch(`${API_URL}${path}`, {
			...init,
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...init?.headers,
			},
		}),
}