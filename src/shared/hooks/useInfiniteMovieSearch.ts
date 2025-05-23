import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchMoviesBySearch } from '@/shared/api/omdb'
import { SearchResponseStatus } from '@/shared/types'
import { STALE_TIME } from '../constants'

// Получаем список фильмов по поиску + пагинация (инфинит скролл)
export const useInfiniteMovieSearch = (query: string) => {
	const trimmedQuery = query.trim()

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
		queryKey: ['movies', trimmedQuery],
		queryFn: ({ pageParam = 1 }) => fetchMoviesBySearch(trimmedQuery, pageParam),
		getNextPageParam: (lastPage, allPages) => (lastPage.length < 10 || allPages.length >= 100 ? undefined : allPages.length + 1),
		enabled: !!trimmedQuery,
		staleTime: STALE_TIME,
		retry: false, // по умолчанию реакт квери повторяет запрос 3-4 раза, если приходит ошибка
		initialPageParam: 1,
	})

	const movies = data?.pages.flat() ?? []

	const responseStatus = !trimmedQuery
		? SearchResponseStatus.Init
		: isError || movies.length === 0
		? SearchResponseStatus.NotFound
		: SearchResponseStatus.Ok

	return {
		movies,
		isLoading,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		responseStatus,
	}
}
