'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Bookmark, BookmarkCheck, X } from 'lucide-react'
import styles from './MovieModal.module.css'
import { MovieFull } from '@/shared/types'
import { hasValidPoster } from '@/shared/utils/movie'
import Loader from '../Loader/Loader'
import noDataimg from '../../../../public/NoData.png'

interface Props {
	movie: MovieFull
	isLoading: boolean
	onClose: () => void
	onFavoriteToggle?: () => void
	isFavorite?: boolean
}

const MovieModal: React.FC<Props> = ({ movie, isLoading, onClose, onFavoriteToggle, isFavorite = false }) => {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const timeout = setTimeout(() => setVisible(true), 10)
		return () => clearTimeout(timeout)
	}, [movie.imdbID])

	const handleClose = () => {
		setVisible(false)
		setTimeout(onClose, 200)
	}

	return (
		<div className={`${styles.overlay} ${visible ? styles.show : ''}`} onClick={handleClose}>
			<div className={`${styles.modal} ${visible ? styles.show : ''}`} onClick={e => e.stopPropagation()}>
				<button className={styles.closeButton} onClick={handleClose} aria-label='Close'>
					<X size={24} />
				</button>

				{isLoading ? (
					<Loader />
				) : (
					<>
						<div className={styles.poster}>
							<Image src={hasValidPoster(movie.Poster) ? movie.Poster : noDataimg} width={400} height={600} alt={`Poster for ${movie.Title}`} />
						</div>

						<div className={styles.content}>
							<h2>{movie.Title}</h2>
							<p>
								<strong>Year:</strong> {movie.Year}
							</p>
							<p>
								<strong>Type:</strong> {movie.Type}
							</p>
							<p>
								<strong>imdbID:</strong> {movie.imdbID}
							</p>

							{movie.Plot && (
								<p>
									<strong>Plot:</strong> {movie.Plot}
								</p>
							)}
							{movie.imdbRating && (
								<p>
									<strong>IMDb Rating:</strong> {movie.imdbRating}
								</p>
							)}

							<button onClick={onFavoriteToggle} className={styles.bookmarkButton} aria-label='Toggle favorite'>
								{isFavorite ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
								<span className={styles.bookmarkText}>{isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}</span>
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default MovieModal
