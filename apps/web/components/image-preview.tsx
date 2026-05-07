'use client'

import { Box, Input, Image } from '@yamada-ui/react'

type Props = {
  preview: string | null
  onChange?: (file: File, preview: string) => void
  readOnly?: boolean
}

export default function ImagePreview({ preview, onChange, readOnly = false }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected || !onChange) return
    onChange(selected, URL.createObjectURL(selected))
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
          maxH="300px"
          objectFit="contain"
          mt={readOnly ? '0' : 'sm'}
        />
      )}
    </Box>
  )
}