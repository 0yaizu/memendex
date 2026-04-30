'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Center, VStack, Input, Button, Heading, Text, Link } from '@yamada-ui/react'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignUp = async () => {
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    })

    if (error) {
      setError(error.message ?? 'サインアップに失敗しました')
      return
    }

    router.push('/')
  }

  return (
    <Center minH="100vh">
      <VStack w="sm" gap="md">
        <Heading>アカウント作成</Heading>
        {error && <Text color="danger">{error}</Text>}
        <Input
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Button w="full" onClick={handleSignUp}>
          アカウントを作成
        </Button>
        <Link href="/sign-in">すでにアカウントをお持ちの方</Link>
      </VStack>
    </Center>
  )
}