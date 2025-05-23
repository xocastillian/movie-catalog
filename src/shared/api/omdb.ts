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
export const fetchMoviesBySearch = async (
	query: string,
	pageOrParams?: number | Record<string, string>,
	extraParams: Record<string, string> = {}
): Promise<Movie[]> => {
	let page: number | undefined = undefined
	let params: Record<string, string> = {}

	if (typeof pageOrParams === 'object') {
		params = pageOrParams
	} else {
		page = pageOrParams ?? 1
		params = extraParams
		if (page < 1 || page > 100) throw new OMDbError('page должен быть от 1 до 100')
	}

	const finalParams: Record<string, string> = {
		...(query.trim() ? { s: query.trim() } : {}),
		...(page !== undefined ? { page: String(page) } : {}),
		...params,
	}

	const res = await axiosInstance.get<SearchResponse>('', { params: finalParams })

	if (res.data.Response === 'False') {
		throw new OMDbError(res.data.Error || 'Ошибка поиска фильмов')
	}

	return res.data.Search
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
