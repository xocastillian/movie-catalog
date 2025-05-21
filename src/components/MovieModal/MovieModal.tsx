'use client'

import React, { useEffect, useState } from 'react'
import styles from './MovieModal.module.css'
import Image from 'next/image'
import { Movie } from '@/types'
import fallbackImg from '../../img1.png'
import { X, Bookmark, BookmarkCheck } from 'lucide-react'
import Loader from '../Loader/Loader'
import { favoritesStorage } from '@/utils/storage'

interface Props {
	movie: Movie
	isLoading: boolean
	onClose: () => void
	onFavoriteToggle?: () => void
}

const MovieModal: React.FC<Props> = ({ movie, isLoading, onClose, onFavoriteToggle }) => {
	const [visible, setVisible] = useState(false)
	const [isFavorite, setIsFavorite] = useState(false)
	const hasValidPoster = movie.Poster && movie.Poster.startsWith('http')

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
		setIsFavorite(prev => !prev)
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
							<Image src={hasValidPoster ? movie.Poster : fallbackImg} width={400} height={600} alt='poster' />
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
							<p>
								<strong>IMDb Rating:</strong> {movie.imdbRating}
							</p>
							<p>
								<strong>Plot:</strong> {movie.Plot}
							</p>

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
