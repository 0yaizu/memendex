'use client'

import { Box, Input, Image } from '@yamada-ui/react'
import { useEffect, useState } from 'react'

type Props = {
  preview: string | null
  onChange?: (file: File, preview: string) => void
  readOnly?: boolean
}

export default function ImagePreview({ preview, onChange, readOnly = false }: Props) {
	const [objectUrl, setObjectUrl] = useState<string | null>(null)

	useEffect(() => {
		return () => {
			if (objectUrl) URL.revokeObjectURL(objectUrl)
		}
	}, [objectUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected || !onChange) return

		if (objectUrl) URL.revokeObjectURL(objectUrl)

		const url = URL.createObjectURL(selected)
		setObjectUrl(url)
    onChange(selected, url)
  }

  return (
    <Box w="full">
      {!readOnly && (
        <Input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
        />
      )}
      {preview && (
        <Image
          src={preview}
          alt="プレビュー"
					w="full"
          maxH="400px"
          objectFit="contain"
          mt={readOnly ? '0' : 'sm'}
        />
      )}
    </Box>
  )
}