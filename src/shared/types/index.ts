export type Movie = {
	Title: string
	Year: string
	imdbID: string
	Type: 'movie' | 'series' | 'episode'
	Poster: string
	Plot: string
	imdbRating: string
}

// использую типа как флаг, чтобы выводить нужную надпись под строкой поиска
export enum SearchResponseStatus {
	Init,
	Ok,
	NotFound,
}
