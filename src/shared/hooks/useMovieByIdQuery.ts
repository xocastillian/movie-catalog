import { useQuery } from '@tanstack/react-query'
import { fetchMovieById } from '../api/omdb'

export const useMovieByIdQuery = (imdbID: string, enabled: boolean = true) =>
	useQuery({
		queryKey: ['movie', imdbID],
		queryFn: () => fetchMovieById(imdbID),
		enabled,
		staleTime: 1000 * 60 * 10, // 10 минут кэш
	})
