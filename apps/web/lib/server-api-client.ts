import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787'

export const serverApiClient = {
	get: async (path: string) => {
		const cookieStore = await cookies()
		const cookie = cookieStore.toString()

		return fetch(`${API_URL}${path}`, {
			headers: {
				'Content-Type': 'application/json',
				'Cookie': cookie,
			},
			cache: 'no-store',
		})
	},
}
