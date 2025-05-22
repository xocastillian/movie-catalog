import { Movie } from '../types'
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

class OMDbError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'OMDbError'
	}
}

// Получаем список фильмов по поиску
export const fetchMoviesBySearch = async (query: string): Promise<Movie[]> => {
	try {
		const res = await axiosInstance.get<SearchResponse>('', {
			params: { s: query },
		})

		if (res.data.Response === 'False') {
			throw new OMDbError(res.data.Error || 'Ошибка поиска фильмов')
		}

		return res.data.Search
	} catch (error) {
		console.error('Ошибка в fetchMoviesBySearch:', error)
		throw error
	}
}

// Получаем расширенную информацию по ID
export const fetchMovieById = async (imdbID: string): Promise<Pick<FullMovieResponse, 'Plot' | 'imdbRating'>> => {
	try {
		const res = await axiosInstance.get<FullMovieResponse>('', {
			params: { i: imdbID },
		})

		if (res.data.Response === 'False') {
			throw new OMDbError(res.data.Error || 'Фильм не найден')
		}

		return {
			Plot: res.data.Plot,
			imdbRating: res.data.imdbRating,
		}
	} catch (error) {
		console.error('Ошибка в fetchMovieById:', error)
		throw error
	}
}
