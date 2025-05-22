import { fetchMoviesBySearch } from '@/shared/api/omdb'
import { Movie } from '@/shared/types'
import { MovieWidget } from '@/widgets'

export const HomePage = async () => {
	const initialMovies: Movie[] = await fetchMoviesBySearch('2025', { y: '2025' })
	return <MovieWidget initialMovies={initialMovies} title='Новинки 2025 года' />
}
