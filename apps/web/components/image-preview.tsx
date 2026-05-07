'use client'

import { Box, Input, Image } from '@yamada-ui/react'

type Props = {
  preview: string | null
  onChange: (file: File, preview: string) => void
}

export default function ImagePreview({ preview, onChange }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    onChange(selected, URL.createObjectURL(selected))
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