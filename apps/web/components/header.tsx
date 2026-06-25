'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Box, Heading, HStack, Button, Link } from '@yamada-ui/react'

type Props = {
  isLoggedIn: boolean
}

export default function Header({ isLoggedIn }: Props) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const showNav = isPending ? isLoggedIn : !!session

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/sign-in')
  }

  return (
    <Box as="header" px="lg" py="md" borderBottomWidth="1px">
      <HStack justifyContent="space-between">
        <Link href="/">
					<Heading size="md">Memendex</Heading>
				</Link>
        {showNav && (
					<HStack gap="sm">
						<Button padding="sm" onClick={() => router.push('/upload')} variant="ghost">アップロード</Button>
						<Button padding="sm" onClick={handleSignOut}>サインアウト</Button>
					</HStack>
        )}
      </HStack>
    </Box>
  )
}