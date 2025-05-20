import { Movie } from '@/types'
import { axiosInstance } from './axios'

type SearchResponse = {
	Search: Movie[]
	Response: 'True' | 'False'
	Error?: string
}

type FullMovieResponse = Movie & {
	Plot: string
	imdbRating: string
	Response: 'True' | 'False'
	Error?: string
}

export const fetchMoviesBySearch = async (query: string): Promise<Movie[]> => {
	const res = await axiosInstance.get<SearchResponse>('', {
		params: { s: query },
	})

	if (res.data.Response === 'False') {
		throw new Error(res.data.Error || 'Search failed')
	}

	return res.data.Search
}

export const fetchMovieById = async (imdbID: string): Promise<Pick<Movie, 'Plot' | 'imdbRating'>> => {
	const res = await axiosInstance.get<FullMovieResponse>('', {
		params: { i: imdbID },
	})

	if (res.data.Response === 'False') {
		throw new Error(res.data.Error || 'Movie not found')
	}

	return {
		Plot: res.data.Plot,
		imdbRating: res.data.imdbRating,
	}
}
