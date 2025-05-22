import { useMemo, useState } from 'react'
import { SearchResponseStatus } from '../types'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'

// хук для поиска фильмов чрез строку поиска
import { useSearchMoviesQuery } from './useSearchMoviesQuery'

export const useMovieSearch = (debounceDelay = 500) => {
	const [query, setQuery] = useState('')
	const debouncedQuery = useDebouncedValue(query, debounceDelay)

	const { data: movies = [], isFetching: isLoading, isError } = useSearchMoviesQuery(debouncedQuery, !!debouncedQuery.trim())

	const responseStatus = useMemo(() => {
		if (!debouncedQuery.trim()) return SearchResponseStatus.Init
		if (isError || movies.length === 0) return SearchResponseStatus.NotFound
		return SearchResponseStatus.Ok
	}, [debouncedQuery, isError, movies])

	return {
		query,
		setQuery,
		movies,
		isLoading,
		responseStatus,
	}
}
