import { fetchMoviesBySearch } from '@/shared/api/omdb'
import { CURRENT_YEAR } from '@/shared/constants'
import { Movie } from '@/shared/types'
import { MovieWidget } from '@/widgets'

/**
 * Используется SSR, потому что компонент является async-функцией и данные запрашиваются на сервере до рендера страницы.
 * Это даёт следующие преимущества:
 * - мгновенное отображение списка фильмов при первом открытии страницы
 * - улучшенное SEO (данные уже встроены в HTML-ответ)
 * Можно было бы использовать ISR, но как часто валидировать, раз в год?) Не думаю что разрабы этого АПИ хотя бы раз в день обновляют базу, вы это поймете, когда увидите что за фильмы отдаст сервер за 2025 год
 */
export const HomePage = async () => {
	const initialMovies: Movie[] = await fetchMoviesBySearch(CURRENT_YEAR, { y: CURRENT_YEAR })
	return <MovieWidget initialMovies={initialMovies} title={`New movies ${CURRENT_YEAR}`} />
}
