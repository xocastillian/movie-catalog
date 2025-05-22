import { useQuery } from '@tanstack/react-query'
import { fetchMoviesBySearch } from '../api/omdb'

export const useSearchMoviesQuery = (query: string, enabled: boolean = true) =>
	useQuery({
		queryKey: ['movies', query],
		queryFn: () => fetchMoviesBySearch(query),
		enabled,
		staleTime: 1000 * 60 * 5, // 5 минут
	})
