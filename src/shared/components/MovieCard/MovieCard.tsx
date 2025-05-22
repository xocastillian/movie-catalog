import React from 'react'
import styles from './MovieCard.module.css'
import Image from 'next/image'
import { Movie } from '@/shared/types'
import noDataimg from '../../../../public/NoData.png'
import { hasValidPoster, truncate } from '@/shared/utils/movie'

interface MovieCardProps {
	movie: Movie
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
	return (
		<div className={styles.card}>
			<Image className={styles.poster} src={hasValidPoster(movie.Poster) ? movie.Poster : noDataimg} width={200} height={300} alt='movie img' />
			<div className={styles.descr}>
				<span className={styles.text}>Title: {truncate(movie.Title, 15)}</span>
				<span className={styles.text}>Year: {movie.Year}</span>
				<span className={styles.text}>imdbID: {movie.imdbID}</span>
				<span className={styles.text}>Type: {movie.Type}</span>
			</div>
		</div>
	)
}

export default MovieCard
