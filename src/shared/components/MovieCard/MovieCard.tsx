import React from 'react'
import styles from './MovieCard.module.css'
import Image from 'next/image'
import { Movie } from '@/shared/types'
import noDataimg from '../../../../public/NoData.png'
import { hasValidPoster, truncate } from '@/shared/utils/movie'

interface MovieCardProps {
	props: Movie
}

const MovieCard: React.FC<MovieCardProps> = ({ props }) => {
	return (
		<div className={styles.card}>
			<Image className={styles.poster} src={hasValidPoster(props.Poster) ? props.Poster : noDataimg} width={200} height={300} alt='movie img' />
			<div className={styles.descr}>
				<span className={styles.text}>Title: {truncate(props.Title, 15)}</span>
				<span className={styles.text}>Year: {props.Year}</span>
				<span className={styles.text}>imdbID: {props.imdbID}</span>
				<span className={styles.text}>Type: {props.Type}</span>
			</div>
		</div>
	)
}

export default MovieCard
