'use client'

import useSWR from 'swr'
import { apiClient } from '@lib/api-client'
import { Box, Grid, Image, Text, VStack, Heading, Center, Loading } from '@yamada-ui/react'
import NextLink from 'next/link'

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

const fetcher = async (url: string): Promise<Meme[]> => {
	const res = await apiClient.get(url)
	if (!res.ok) throw new Error('Failed to fetch memes')
	const data = await res.json()
	return data.memes
}

export default function GalleryPage() {
	const { data: memes, isLoading } = useSWR<Meme[]>('/api/memes', fetcher, {
		revalidateOnFocus: true,  // タブ復帰時の再取得（visibilitychange の代替）
		keepPreviousData: true,   // 再取得中もキャッシュデータを表示し続ける
	})

  if (isLoading) {
    return (
      <Center minH="50vh">
        <Loading.Dots />
      </Center>
    )
  }

  if (!memes || memes.length === 0) {
    return (
      <Center minH="50vh" justifyContent="center" textAlign="center">
				<Text>
					まだミームがありません
					<br/>
					<NextLink href="/upload" color="blue.700">
						アップロードしてみましょう
					</NextLink>
				</Text>
			</Center>
		)
	}

  return (
    <Box p="lg">
      <Heading mb="lg">ギャラリー</Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap="md">
        {memes.map((meme) => (
          <NextLink key={meme.id} href={`/memes/${meme.id}`}>
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
          </NextLink>
        ))}
      </Grid>
    </Box>
  )
}