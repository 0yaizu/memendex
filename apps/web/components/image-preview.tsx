'use client'

import { Box, Image } from '@yamada-ui/react'

type Props = {
	src: string
}

export default function ImagePreview({ src }: Props) {
	return (
		<Box w="full" overflow="hidden">
			<Image
				src={src}
				alt="プレビュー"
				w="full"
				maxH="400px"
				objectFit="contain"
			/>
		</Box>
	)
}