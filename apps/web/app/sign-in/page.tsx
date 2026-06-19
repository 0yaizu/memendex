'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Center, VStack, Input, Button, Heading, Text } from '@yamada-ui/react'

type Providers = {
	email: boolean
	google: boolean
	twitter: boolean
	discord: boolean
}

export default function SignInPage() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [providers, setProviders] = useState<Providers | null>(null)

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/providers`, { credentials: 'include' })
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				return res.json()
			})
			.then((data) => setProviders(data))
			.catch(() => setProviders({ email: false, google: false, twitter: false, discord: false }))
	}, [])

	const handleSignIn = async () => {
		const { error } = await authClient.signIn.email({
			email,
			password,
		})

		if (error) {
			setError(error.message ?? 'サインインに失敗しました')
			return
		}

		router.push('/')
	}

	const handleSocialSignIn = async (provider: 'google' | 'twitter' | 'discord') => {
		const { error: signInError } = await authClient.signIn.social({
			provider,
			callbackURL: `${window.location.origin}/`
		})
		if (signInError) {
			setError(signInError.message ?? 'サインインに失敗しました')
		}
	}

	const emailInputForm = (
		<VStack>
			<Input
				type="email"
				placeholder="メールアドレス"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<Input
				type="password"
				placeholder="パスワード"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<Button w="full" onClick={handleSignIn}>
				サインイン
			</Button>
		</VStack>
	)

	return (
		<Center minH="100vh">
			<VStack w="md" gap="md" p="xl" borderWidth="1px" borderRadius="xl" boxShadow="sm" alignItems="center">
				<Heading>サインイン</Heading>
				{error && <Text color="danger">{error}</Text>}
				{providers?.email && emailInputForm}
				{providers === null ? (<Text>読み込み中...</Text>) : (
					<>
						{providers?.google && (
							<Button w="full" variant="outline" onClick={() => handleSocialSignIn('google')}>
								Googleでサインイン
							</Button>
						)}
						{providers?.twitter && (
							<Button w="full" variant="outline" onClick={() => handleSocialSignIn('twitter')}>
								Xでサインイン
							</Button>
						)}
						{providers?.discord && (
							<Button w="full" variant="outline" onClick={() => handleSocialSignIn('discord')}>
								Discordでサインイン
							</Button>
						)}
					</>
				)}
			</VStack>
		</Center>
	)
}