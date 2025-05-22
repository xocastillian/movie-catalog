export const hasValidPoster = (poster?: string): boolean => {
	return Boolean(poster && poster.startsWith('http'))
}

export const truncate = (text: string, length: number): string => {
	return text.length > length ? `${text.slice(0, length)}...` : text
}
