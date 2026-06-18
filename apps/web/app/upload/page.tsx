'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Heading, Input, Textarea, VStack, Text, HStack } from '@yamada-ui/react'
import TagInput from '@components/tag-input'
import ImageInput from '@components/image-input'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tagList, setTagList] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file || !title) {
      setError('画像とタイトルは必須です')
      return
    }

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('image', file)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('tags', JSON.stringify(tagList))

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/memes/upload`,
      {
        method: 'POST',
        credentials: 'include',
        body: formData,
      }
    )

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'アップロードに失敗しました')
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <Box p="lg" maxW="600px" mx="auto">
			<HStack justifyContent="space-between" alignItems="center" mb="lg">
				<Heading>ミームをアップロード</Heading>
				<Button onClick={() => router.back()} variant="ghost">キャンセル</Button>
			</HStack>
      <VStack gap="md">
        {error && <Text color="danger">{error}</Text>}
				<ImageInput onChange={(f) => setFile(f)} />
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
          onClick={handleUpload}
          loading={loading}
          disabled={!file || !title}
        >
          アップロード
        </Button>
      </VStack>
    </Box>
  )
}