'use client'

import { useHorizontalScroll } from '@/shared/hooks/useHorizontalScroll'
import { Movie, MovieFull, SearchResponseStatus } from '@/shared/types'
import { Loader, MovieCard, MovieModal } from '@/shared/components'
import styles from './MovieList.module.css'

interface Props {
	movies: Movie[]
	isLoading: boolean
	selectedMovie: MovieFull | null
	modalLoading: boolean
	onSelect: (movie: Movie) => void
	onCloseModal: () => void
	responseStatus: SearchResponseStatus
	isRecent?: boolean
	onFavoriteToggle?: () => void
}

const MovieList: React.FC<Props> = ({
	movies,
	isLoading,
	selectedMovie,
	modalLoading,
	onSelect,
	onCloseModal,
	responseStatus,
	isRecent = false,
	onFavoriteToggle,
}) => {
	const scrollRef = useHorizontalScroll<HTMLDivElement>(isRecent && movies.length > 5)

	const renderList = () => {
		if (isRecent) {
			return (
				<div className={styles.carouselWrapper}>
					<div className={styles.scrollContainer} ref={scrollRef}>
						<div className={styles.scrollInner}>
							{movies.map(movie => (
								<div className={styles.scrollItem} key={movie.imdbID} onClick={() => onSelect(movie)}>
									<MovieCard props={movie} />
								</div>
							))}
						</div>
					</div>
				</div>
			)
		}

		return (
			<>
				<div className={styles.list}>
					{movies.map(movie => (
						<div key={movie.imdbID} onClick={() => onSelect(movie)}>
							<MovieCard props={movie} />
						</div>
					))}
				</div>

				{movies.length === 0 && (
					<p className={styles.emptyText}>{responseStatus === SearchResponseStatus.NotFound ? 'Здесь пусто :(' : 'Введите название фильма'}</p>
				)}
			</>
		)
	}

	return (
		<div className={styles.container}>
			{isLoading ? <Loader /> : renderList()}

			{selectedMovie && <MovieModal movie={selectedMovie} isLoading={modalLoading} onClose={onCloseModal} onFavoriteToggle={onFavoriteToggle} />}
		</div>
	)
}

export default MovieList
