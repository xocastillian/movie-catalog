'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Bookmark, BookmarkCheck, X } from 'lucide-react'
import styles from './MovieModal.module.css'
import { MovieFull } from '@/shared/types'
import { favoritesStorage } from '@/shared/utils/storage'
import { hasValidPoster } from '@/shared/utils/movie'
import Loader from '../Loader/Loader'
import noDataimg from '../../../../public/NoData.png'

interface Props {
	movie: MovieFull
	isLoading: boolean
	onClose: () => void
	onFavoriteToggle?: () => void
}

const MovieModal: React.FC<Props> = ({ movie, isLoading, onClose, onFavoriteToggle }) => {
	const [visible, setVisible] = useState(false)
	const [isFavorite, setIsFavorite] = useState(false)

	useEffect(() => {
		const timeout = setTimeout(() => setVisible(true), 10)
		setIsFavorite(favoritesStorage.isFavorite(movie.imdbID))
		return () => clearTimeout(timeout)
	}, [movie.imdbID])

	const handleClose = () => {
		setVisible(false)
		setTimeout(onClose, 200)
	}

	const toggleFavorite = () => {
		favoritesStorage.toggle(movie)
		setIsFavorite(favoritesStorage.isFavorite(movie.imdbID))
		onFavoriteToggle?.()
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
							{(movie as MovieFull).Plot && (
								<p>
									<strong>Plot:</strong> {(movie as MovieFull).Plot}
								</p>
							)}
							{(movie as MovieFull).imdbRating && (
								<p>
									<strong>IMDb Rating:</strong> {(movie as MovieFull).imdbRating}
								</p>
							)}

							<button onClick={toggleFavorite} className={styles.bookmarkButton} aria-label='Toggle favorite'>
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
