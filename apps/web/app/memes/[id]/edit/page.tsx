'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Box, Button, Heading, Input, Textarea, VStack, Text, Center, HStack, Loading } from '@yamada-ui/react'
import TagInput from '@components/tag-input'
import ImagePreview from '@components/image-preview'

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

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [meme, setMeme] = useState<Meme | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tagList, setTagList] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
		const fetchMeme = async () => {
			try{
				const res = await apiClient.get(`/api/memes/${id}`)
				if (!res.ok) {
					setError('ミームが見つかりません')
					return
				}
				const data = await res.json()
				setMeme(data.meme)
				setTitle(data.meme.title)
				setDescription(data.meme.description ?? '')
				setTagList(data.meme.memeTags.map((mt: MemeTag) => mt.tag.name))
			}
			catch {
				setError('通信エラーが発生しました')
			}
			finally {
				setLoading(false)
			}
		}
    fetchMeme()
  }, [id])

  const handleSave = async () => {
    if (!title) {
      setError('タイトルは必須です')
      return
    }

    setSaving(true)
    setError('')

		try {
    // タイトル・説明を更新
    const res = await apiClient.patch(`/api/memes/${id}`, { title, description })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? '更新に失敗しました')
      return
    }

    // タグを更新
    if (meme) {
      const currentTags = meme.memeTags.map((mt) => mt.tag.name)

      // 追加するタグ
      const tagsToAdd = tagList.filter((t) => !currentTags.includes(t))
      for (const name of tagsToAdd) {
				const res = await apiClient.post(`/api/memes/${id}/tags`, { name })
				if (!res.ok) {
					const data = await res.json()
					setError(data.error ?? `タグ「${name}」の追加に失敗しました`)
					return
				}
			}

      // 削除するタグ
      const tagsToRemove = meme.memeTags.filter((mt) => !tagList.includes(mt.tag.name))
      for (const mt of tagsToRemove) {
				const res = await apiClient.delete(`/api/memes/${id}/tags/${mt.tagId}`)
				if (!res.ok) {
					const data = await res.json()
					setError(data.error ?? `タグ「${mt.tag.name}」の削除に失敗しました`)
					setSaving(false)
					return
				}
			}
    }

    router.push(`/memes/${id}`)
	}
	catch {
		setError('通信エラーが発生しました')
	}
	finally {
		setSaving(false)
	}
  }

  if (loading) {
    return (
      <Center minH="50vh">
        <Loading.Dots />
      </Center>
    )
  }

  if (error && !meme) {
    return (
      <Center minH="50vh">
        <Text>{error}</Text>
      </Center>
    )
  }

  return (
    <Box p="lg" maxW="600px" mx="auto">
      <HStack justifyContent="space-between" mb="lg">
        <Heading>ミームを編集</Heading>
        <Button variant="ghost" onClick={() => router.back()}>戻る</Button>
      </HStack>
			<ImagePreview
				preview={`${process.env.NEXT_PUBLIC_API_URL}/api/memes/image/${meme?.imageUrl}`}
				readOnly
			/>
      <VStack gap="md">
        {error && <Text color="danger">{error}</Text>}
        <Input
          placeholder="タイトル（必須）"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="説明（任意）"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TagInput tagList={tagList} onChange={setTagList} />
        <Button
          w="full"
          onClick={handleSave}
          loading={saving}
          disabled={!title}
        >
          保存
        </Button>
      </VStack>
    </Box>
  )
}