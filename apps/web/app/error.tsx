'use client'

import { Text } from "@packages/ui"

export default function Error({ error }: { error: Error }) {
	const status = Number(error.message)
	const statusText = !isNaN(status) ? `（${status}）` : ''

	if (status === 401) return <Text>ログインし直してください</Text>
	if (status === 403) return <Text>アクセス権限がありません</Text>
	return <Text>エラーが発生しました{statusText}</Text>
}