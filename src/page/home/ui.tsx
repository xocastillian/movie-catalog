import { fetchMoviesBySearch } from '@/shared/api/omdb'
import { CURRENT_YEAR } from '@/shared/constants'
import { Movie } from '@/shared/types'
import { MovieWidget } from '@/widgets'

export const HomePage = async () => {
	const initialMovies: Movie[] = await fetchMoviesBySearch(CURRENT_YEAR, { y: CURRENT_YEAR })
	return <MovieWidget initialMovies={initialMovies} title={`New movies ${CURRENT_YEAR}`} />
}
