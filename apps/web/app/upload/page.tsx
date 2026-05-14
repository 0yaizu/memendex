'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Heading, Input, Textarea, VStack, Text, Image } from '@yamada-ui/react'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

	useEffect(() => {
		return () => {
			if (preview) URL.revokeObjectURL(preview)
		}
	}, [preview])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

		if (preview) URL.revokeObjectURL(preview)

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

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
        <Input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
        />
        {preview && (
          <Image
            src={preview}
            alt="プレビュー"
            maxH="300px"
            objectFit="contain"
          />
        )}
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