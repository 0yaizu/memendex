'use client'

import { Box, Input, Image } from '@yamada-ui/react'
import { useEffect, useState } from 'react'

type Props = {
  preview: string | null
  onChange: (file: File, preview: string) => void
}

export default function ImagePreview({ preview, onChange }: Props) {
	const [objectUrl, setObjectUrl] = useState<string | null>(null)

	useEffect(() => {
		return () => {
			if (objectUrl) URL.revokeObjectURL(objectUrl)
		}
	}, [objectUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

		if (objectUrl) URL.revokeObjectURL(objectUrl)

		const url = URL.createObjectURL(selected)
		setObjectUrl(url)
    onChange(selected, url)
  }

  return (
    <Box w="full">
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
          mt="sm"
        />
      )}
    </Box>
  )
}