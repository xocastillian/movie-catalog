import { useEffect, useState, useRef } from 'react'
import { Movie, SearchResponseStatus } from '../types'
import { fetchMoviesBySearch } from '../api/omdb'

export const useMovieSearch = (debounceDelay = 500) => {
	const [query, setQuery] = useState('')
	const [movies, setMovies] = useState<Movie[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [responseStatus, setResponseStatus] = useState<SearchResponseStatus>(SearchResponseStatus.Init)

	const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		if (!query.trim()) {
			setMovies([])
			setResponseStatus(SearchResponseStatus.Init)
			return
		}

		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current)
		}

		setIsLoading(true)

		debounceTimer.current = setTimeout(() => {
			fetchMoviesBySearch(query)
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
		}, debounceDelay)

		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current)
			}
		}
	}, [query, debounceDelay])

	return {
		query,
		setQuery,
		movies,
		isLoading,
		responseStatus,
	}
}
