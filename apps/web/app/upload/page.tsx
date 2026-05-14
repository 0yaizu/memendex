'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Heading, Input, Textarea, VStack, Text } from '@yamada-ui/react'
import TagInput from '@components/tag-input'
import ImagePreview from '@components/image-preview'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
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
      <Heading mb="lg">ミームをアップロード</Heading>
      <VStack gap="md">
        {error && <Text color="danger">{error}</Text>}
        <ImagePreview
          preview={preview}
          onChange={(f, p) => { setFile(f); setPreview(p) }}
        />
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