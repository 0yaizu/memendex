'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Box, Heading, Text, VStack, HStack, Badge, Image, Center, Button } from '@yamada-ui/react'
import { Loading } from '@yamada-ui/react'
import Link from 'next/link'

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
	const params = useParams()
	const id = Array.isArray(params.id) ? params.id[0] : params.id
  const [meme, setMeme] = useState<Meme | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMeme = async () => {
      const res = await apiClient.get(`/api/memes/${id}`)
      if (!res.ok) {
        setError('ミームが見つかりません')
        setLoading(false)
        return
      }
      const data = await res.json()
      setMeme(data.meme)
      setLoading(false)
    }
    fetchMeme()
  }, [id])

  if (loading) {
    return (
      <Center minH="50vh">
        <Loading.Dots />
      </Center>
    )
  }

  if (error || !meme) {
    return (
      <Center minH="50vh">
        <Text>{error}</Text>
      </Center>
    )
  }

  return (
    <Box p="lg" maxW="800px" mx="auto">
      <VStack gap="lg" alignItems="flex-start">
        <HStack justifyContent="space-between" w="full">
          <Heading>{meme.title}</Heading>
          <Link href="/">
            <Button variant="ghost">戻る</Button>
          </Link>
        </HStack>
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/api/memes/image/${meme.imageUrl}`}
          alt={meme.title}
          maxH="500px"
          objectFit="contain"
          borderRadius="md"
        />
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
      </VStack>
    </Box>
  )
}