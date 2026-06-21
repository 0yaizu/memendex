import { apiClient } from "./api-client"

export const fetcher = (url: string) =>
	apiClient.get(url).then((res) => {
		if (!res.ok) throw new Error(`HTTP ${res.status}`)
		return res.json()
	})
