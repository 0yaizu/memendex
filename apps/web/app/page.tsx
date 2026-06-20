'use client'

import useSWR from 'swr'
import { apiClient } from '@lib/api-client'
import { Box, Grid, Image, Text, VStack, Heading, Center, Loading, Link } from '@yamada-ui/react'

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

const fetchMemes = () => apiClient.get('/api/memes').then((res) => res.json())

export default function GalleryPage() {
  const { data, isLoading } = useSWR<{ memes: Meme[] }>('/api/memes', fetchMemes)
  const memes = data?.memes ?? []

  if (isLoading) {
    return (
      <Center minH="50vh">
        <Loading.Dots />
      </Center>
    )
  }

  if (memes.length === 0) {
    return (
      <Center minH="50vh" justifyContent="center" textAlign="center">
				<Text>
					まだミームがありません
					<br/>
					<Link href="/upload" color="blue.700">
						アップロードしてみましょう
					</Link>
				</Text>
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