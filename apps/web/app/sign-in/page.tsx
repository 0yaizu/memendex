'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Center, VStack, Input, Button, Heading, Text } from '@yamada-ui/react'

const emailAuthEnabled = process.env.NEXT_PUBLIC_EMAIL_AUTH_ENABLED === 'true'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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

	const handleSocialSignIn = async (provider: 'google' | 'twitter') => {
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
        {emailAuthEnabled && emailInputForm}
        <Button w="full" variant="outline" onClick={() => handleSocialSignIn('google')}>
          Googleでサインイン
        </Button>
        <Button w="full" variant="outline" onClick={() => handleSocialSignIn('twitter')}>
          Xでサインイン
        </Button>
      </VStack>
    </Center>
  )
}