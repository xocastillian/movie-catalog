// Next Image ругается, если poster не является ссылкой
export const hasValidPoster = (poster?: string): boolean => {
	return Boolean(poster && poster.startsWith('http'))
}

// В названии фильма могут быть не более 15 символов, поэтому обрезаем
export const truncate = (text: string, length: number): string => {
	return text.length > length ? `${text.slice(0, length)}...` : text
}
