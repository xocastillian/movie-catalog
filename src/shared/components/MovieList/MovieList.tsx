'use client'

import { useHorizontalScroll } from '@/shared/hooks/useHorizontalScroll'
import { Movie, SearchResponseStatus } from '@/shared/types'
import { Loader, MovieCard } from '@/shared/components'
import styles from './MovieList.module.css'
import { memo } from 'react'

interface Props {
	movies: Movie[]
	onSelect: (movie: Movie) => void
	responseStatus: SearchResponseStatus
	isRecent?: boolean
	isLoading?: boolean
}

const MovieList: React.FC<Props> = ({ movies, isLoading, onSelect, responseStatus, isRecent = false }) => {
	const scrollRef = useHorizontalScroll<HTMLDivElement>(isRecent && movies.length > 5)

	const handleClick = (movie: Movie) => () => onSelect(movie)

	const renderList = () => {
		if (isRecent) {
			return (
				<div className={styles.carouselWrapper}>
					<div className={styles.scrollContainer} ref={scrollRef}>
						<div className={styles.scrollInner}>
							{movies.map(movie => (
								<div className={styles.scrollItem} key={movie.imdbID} onClick={handleClick(movie)}>
									<MovieCard movie={movie} />
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
						<div key={movie.imdbID} onClick={handleClick(movie)}>
							<MovieCard movie={movie} />
						</div>
					))}
				</div>

				{movies.length === 0 && (
					<p className={styles.emptyText}>{responseStatus === SearchResponseStatus.NotFound ? 'Здесь пусто :(' : 'Введите название фильма'}</p>
				)}
			</>
		)
	}

	return <div className={styles.container}>{isLoading ? <Loader /> : renderList()}</div>
}

export default memo(MovieList)
