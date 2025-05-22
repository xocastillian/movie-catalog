export type MovieShort = {
	Title: string
	Year: string
	imdbID: string
	Type: 'movie' | 'series' | 'episode'
	Poster: string
}

export type MovieFull = MovieShort & {
	Plot: string
	imdbRating: string
}

export type Movie = MovieShort

export enum SearchResponseStatus {
	Init,
	Ok,
	NotFound,
}
