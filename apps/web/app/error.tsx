'use client'

import { Text, VStack } from "@yamada-ui/react"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
	const status = Number(error.message)
	const statusText = !isNaN(status) ? `（${status}）` : ''

	if (status === 401) return <Text>ログインし直してください</Text>
	if (status === 403) return <Text>アクセス権限がありません</Text>
	return (
		<VStack>
			<Text>エラーが発生しました{statusText}</Text>
			<button type="button" onClick={reset}>再試行</button>
		</VStack>
	)
}