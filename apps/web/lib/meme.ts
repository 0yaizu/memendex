const getMemeImageUrl = (imageUrl: string): string => {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL
	if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL or imageUrl is not defined')
	return `${baseUrl}/api/memes/image/${imageUrl}`
}

export { getMemeImageUrl }
