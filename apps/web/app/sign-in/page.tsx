'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Center, VStack, Input, Button, Heading, Text, Link } from '@yamada-ui/react'

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

	const handleGoogleSignIn = async () => {
		await authClient.signIn.social({
			provider: 'google',
			callbackURL: '/'
		})
	}

  return (
    <Center minH="100vh">
      <VStack w="sm" gap="md">
        <Heading>サインイン</Heading>
        {error && <Text color="danger">{error}</Text>}
        {emailAuthEnabled && (
          <>
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
            <Link href="/sign-up">アカウントを作成する</Link>
          </>
        )}
        <Button w="full" variant="outline" onClick={handleGoogleSignIn}>
          Googleでサインイン
        </Button>
      </VStack>
    </Center>
  )
}