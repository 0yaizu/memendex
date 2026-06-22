import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787'

export const serverApiClient = {
	get: async <T>(path: string): Promise<T> => {
		const cookieStore = await cookies()
		const cookie = cookieStore.toString()

		const res = await fetch(`${API_URL}${path}`, {
			headers: {
				'Content-Type': 'application/json',
				'Cookie': cookie,
			},
			cache: 'no-store',
		})
		if (!res.ok) throw new Error(String(res.status))
		return res.json() as T
	},
}
