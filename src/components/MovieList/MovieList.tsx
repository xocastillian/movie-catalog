'use client'

import React from 'react'
import MovieCard from '../MovieCard/MovieCard'
import MovieModal from '../MovieModal/MovieModal'
import Loader from '../Loader/Loader'
import styles from './MovieList.module.css'
import { Movie } from '@/types'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'

export enum SearchResponseStatus {
	Init,
	Ok,
	NotFound,
}

interface Props {
	movies: Movie[]
	isLoading: boolean
	selectedMovie: Movie | null
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
	const scrollRef = useHorizontalScroll<HTMLDivElement>()

	return (
		<div className={styles.container}>
			{isLoading ? (
				<Loader />
			) : (
				<>
					{isRecent ? (
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
					) : (
						<>
							<div className={styles.list}>
								{movies.map(movie => (
									<div key={movie.imdbID} onClick={() => onSelect(movie)}>
										<MovieCard props={movie} />
									</div>
								))}
							</div>

							{movies.length === 0 && (
								<p className={styles.emptyText}>
									{responseStatus === SearchResponseStatus.NotFound ? 'Фильм не найден :(' : 'Введите название фильма'}
								</p>
							)}
						</>
					)}
				</>
			)}

			{selectedMovie && <MovieModal movie={selectedMovie} isLoading={modalLoading} onClose={onCloseModal} onFavoriteToggle={onFavoriteToggle} />}
		</div>
	)
}

export default MovieList
