import React from 'react'
import styles from './MovieCard.module.css'
import Image from 'next/image'
import { Movie } from '@/types'
import fallbackImg from '../../img1.png'

interface MovieCardProps {
	props: Movie
}

const MovieCard: React.FC<MovieCardProps> = ({ props }) => {
	const hasValidPoster = props.Poster && props.Poster.startsWith('http')

	return (
		<div className={styles.card}>
			<Image className={styles.poster} src={hasValidPoster ? props.Poster : fallbackImg} width={200} height={300} alt='movie img' />
			<div className={styles.descr}>
				<span className={styles.text}>Title: {props.Title.length > 15 ? `${props.Title.slice(0, 15)}...` : props.Title}</span>
				<span className={styles.text}>Year: {props.Year}</span>
				<span className={styles.text}>imdbID: {props.imdbID}</span>
				<span className={styles.text}>Type: {props.Type}</span>
			</div>
		</div>
	)
}

export default MovieCard
