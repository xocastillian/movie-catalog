import { useEffect, useState } from 'react'
import { Movie, SearchResponseStatus } from '../types'
import { fetchMoviesBySearch } from '../api/omdb'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'

export const useMovieSearch = (debounceDelay = 500) => {
	const [query, setQuery] = useState('')
	const [movies, setMovies] = useState<Movie[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [responseStatus, setResponseStatus] = useState<SearchResponseStatus>(SearchResponseStatus.Init)

	const debouncedQuery = useDebouncedValue(query, debounceDelay)

	useEffect(() => {
		if (!debouncedQuery.trim()) {
			setMovies([])
			setResponseStatus(SearchResponseStatus.Init)
			return
		}

		setIsLoading(true)

		fetchMoviesBySearch(debouncedQuery)
			.then(res => {
				if (res.length > 0) {
					setMovies(res)
					setResponseStatus(SearchResponseStatus.Ok)
				} else {
					setMovies([])
					setResponseStatus(SearchResponseStatus.NotFound)
				}
			})
			.catch(error => {
				console.error('Ошибка при поиске фильмов:', error)
				setMovies([])
				setResponseStatus(SearchResponseStatus.NotFound)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [debouncedQuery])

	return {
		query,
		setQuery,
		movies,
		isLoading,
		responseStatus,
	}
}
