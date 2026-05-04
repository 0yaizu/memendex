'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@lib/api-client'
import { Box, Grid, Image, Text, VStack, Heading, Center, Loading } from '@yamada-ui/react'
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

type Meme = {
  id: number
  userId: string
  imageUrl: string
  title: string
  description: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
  memeTags: MemeTag[]
}

export default function GalleryPage() {
  const [memes, setMemes] = useState<Meme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemes = async () => {
      const res = await apiClient.get('/api/memes')
      const data = await res.json()
      setMemes(data.memes)
      setLoading(false)
    }
    fetchMemes()
  }, [])

  if (loading) {
    return (
      <Center minH="50vh">
        <Loading.Dots />
      </Center>
    )
  }

  if (memes.length === 0) {
    return (
      <Center minH="50vh">
        <Text>まだミームがありません</Text>
      </Center>
    )
  }

  return (
    <Box p="lg">
      <Heading mb="lg">ギャラリー</Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap="md">
        {memes.map((meme) => (
          <Link key={meme.id} href={`/memes/${meme.id}`}>
            <VStack
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/api/memes/image/${meme.imageUrl}`}
                alt={meme.title}
                w="full"
                h="200px"
                objectFit="cover"
              />
              <Box p="sm">
                <Text fontWeight="bold" fontSize="sm">{meme.title}</Text>
                {meme.memeTags.length > 0 && (
                  <Text fontSize="xs" color="gray.500">
                    {meme.memeTags.map((mt) => `#${mt.tag.name}`).join(' ')}
                  </Text>
                )}
              </Box>
            </VStack>
          </Link>
        ))}
      </Grid>
    </Box>
  )
}