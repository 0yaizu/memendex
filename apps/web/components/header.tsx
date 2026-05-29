'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Box, Heading, HStack, Button } from '@yamada-ui/react'

export default function Header() {
  const router = useRouter()
	const { data: session } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/sign-in')
  }

  return (
    <Box as="header" px="lg" py="md" borderBottomWidth="1px">
      <HStack justifyContent="space-between">
        <Heading size="md">Memendex</Heading>
        {session && (
          <Button onClick={handleSignOut} variant="ghost">
            サインアウト
          </Button>
        )}
      </HStack>
    </Box>
  )
}