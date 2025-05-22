// тип для фильма из списка
export type Movie = {
	Title: string
	Year: string
	imdbID: string
	Type: 'movie' | 'series' | 'episode'
	Poster: string
}

// детальный тип для фильма при раскрытии модалки
export type MovieFull = Movie & {
	Plot: string
	imdbRating: string
}

// использую типа как флаг, чтобы выводить нужную надпись под строкой поиска
export enum SearchResponseStatus {
	Init,
	Ok,
	NotFound,
}
