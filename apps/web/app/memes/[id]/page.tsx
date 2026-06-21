'use client'

import useSWR from 'swr'
import { useParams, useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import NextLink from 'next/link'
import { Box, Heading, Text, VStack, HStack, Badge, Center, Button } from '@yamada-ui/react'
import { Loading } from '@yamada-ui/react'
import ImagePreview from '@components/image-preview'
import { getMemeImageUrl } from '@lib/meme'
import { authClient } from '@lib/auth-client'

type Tag = {
  id: number
  name: string
}

type MemeTag = {
  memeId: number
  tagId: number
  tag: Tag
}

type Visibility = 'private' | 'unlisted' | 'public'

type Meme = {
  id: number
  userId: string
  imageUrl: string
  title: string
  description: string | null
  visibility: Visibility
  createdAt: string
  updatedAt: string
  memeTags: MemeTag[]
}

export default function MemeDetailPage() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const { data, isLoading, error } = useSWR<{ meme: Meme }>(
    id ? `/api/memes/${id}` : null,
    (url: string) => apiClient.get(url).then((res) => {
      if (!res.ok) throw new Error('ミームが見つかりません')
      return res.json()
    })
  )

  if (isLoading) {
    return (
      <Center minH="50vh">
        <Loading.Dots />
      </Center>
    )
  }

  if (error || !data?.meme) {
    return (
      <Center minH="50vh">
        <Text>{error?.message ?? 'ミームが見つかりません'}</Text>
      </Center>
    )
  }

  const meme = data.meme

  return (
    <Box p="lg" maxW="800px" mx="auto">
      <VStack gap="lg" alignItems="flex-start">
        <HStack justifyContent="space-between" w="full" gap="lg">
          <Heading>{meme.title}</Heading>
          <Button onClick={() => router.back()} variant="ghost">戻る</Button>
        </HStack>
        <ImagePreview src={getMemeImageUrl(meme.imageUrl)} />
        {meme.description && (
          <Text>{meme.description}</Text>
        )}
        <HStack gap="sm" flexWrap="wrap">
          {meme.memeTags.length > 0 ? (
            meme.memeTags.map((mt) => (
              <Badge key={mt.tagId}>#{mt.tag.name}</Badge>
            ))
          ) : (
            <Text color="gray.500" fontSize="sm">タグなし</Text>
          )}
        </HStack>
        <Text fontSize="xs" color="gray.500">
          {new Date(meme.createdAt).toLocaleDateString('ja-JP')}
        </Text>
        {session?.user.id === meme.userId && (
          <NextLink href={`/memes/${id}/edit`}>
            <Button padding="sm">編集</Button>
          </NextLink>
        )}
      </VStack>
    </Box>
  )
}
