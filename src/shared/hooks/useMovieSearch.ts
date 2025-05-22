import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { fetchMoviesBySearch } from '@/shared/api/omdb'
import { SearchResponseStatus } from '@/shared/types'
import { STALE_TIME } from '../constants'

export const useMovieSearch = (debounceDelay = 500) => {
	const [query, setQuery] = useState('')
	const debouncedQuery = useDebouncedValue(query, debounceDelay)
	const trimmed = debouncedQuery.trim()
	const isValidQuery = !!trimmed

	const {
		data: movies = [],
		isFetching: isLoading,
		isError,
	} = useQuery({
		queryKey: ['movies', trimmed],
		queryFn: () => fetchMoviesBySearch(trimmed),
		enabled: isValidQuery,
		staleTime: STALE_TIME,
		retry: false, // по умолчанию Реакт квери повторяет запрос 3-4 раза, если приходит ошибка
	})

	const responseStatus = useMemo(() => {
		if (!isValidQuery) return SearchResponseStatus.Init
		if (isError || movies.length === 0) return SearchResponseStatus.NotFound
		return SearchResponseStatus.Ok
	}, [isValidQuery, isError, movies])

	return {
		query,
		setQuery,
		movies,
		isLoading,
		responseStatus,
	}
}
