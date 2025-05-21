'use client'

import React, { useEffect, useState } from 'react'
import styles from './MovieModal.module.css'
import Image from 'next/image'
import { Movie } from '@/types'
import fallbackImg from '../../img1.png'
import { X } from 'lucide-react'
import Loader from '../Loader/Loader'

interface Props {
	movie: Movie
	isLoading: boolean
	onClose: () => void
}

const MovieModal: React.FC<Props> = ({ movie, isLoading, onClose }) => {
	const [visible, setVisible] = useState(false)
	const hasValidPoster = movie.Poster && movie.Poster.startsWith('http')

	useEffect(() => {
		const timeout = setTimeout(() => setVisible(true), 10)
		return () => clearTimeout(timeout)
	}, [])

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
							<Image src={hasValidPoster ? movie.Poster : fallbackImg} width={200} height={300} alt='poster' />
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
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default MovieModal
