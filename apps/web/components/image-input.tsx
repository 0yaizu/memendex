'use client'

import { Box, Input } from '@yamada-ui/react'
import { useEffect, useState } from 'react'
import ImagePreview from './image-preview'

type Props = {
  onChange: (file: File, preview: string) => void
}

export default function ImageInput({ onChange }: Props) {
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
			{objectUrl && (
				<ImagePreview src={objectUrl} />
			)}
		</Box>
	)
}