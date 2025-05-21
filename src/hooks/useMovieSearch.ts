import { useEffect, useState } from 'react'
import { fetchMoviesBySearch } from '@/api/fetchMovie'
import { Movie } from '@/types'
import { SearchResponseStatus } from '@/components/MovieList/MovieList'

let debounceTimer: ReturnType<typeof setTimeout>

export const useMovieSearch = () => {
	const [query, setQuery] = useState('')
	const [movies, setMovies] = useState<Movie[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [responseStatus, setResponseStatus] = useState<SearchResponseStatus>(SearchResponseStatus.Init)

	useEffect(() => {
		if (!query.trim()) {
			setMovies([])
			setResponseStatus(SearchResponseStatus.Init)
			return
		}

		clearTimeout(debounceTimer)
		setIsLoading(true)

		debounceTimer = setTimeout(() => {
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
				.catch(() => {
					setMovies([])
					setResponseStatus(SearchResponseStatus.NotFound)
				})
				.finally(() => {
					setIsLoading(false)
				})
		}, 500)
	}, [query])

	return {
		query,
		setQuery,
		movies,
		isLoading,
		responseStatus,
	}
}
