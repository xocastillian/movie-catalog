import React from 'react'
import styles from './MovieCard.module.css'
import Image from 'next/image'
import { Movie } from '@/types'

interface MovieCardProps {
	props: Movie
	isExpanded: boolean
}

const MovieCard: React.FC<MovieCardProps> = ({ props, isExpanded }) => {
	return (
		<div className={`${styles.card} ${isExpanded ? styles.details : ''}`}>
			{!isExpanded ? (
				<>
					{props.Poster && props.Poster.startsWith('http') && <Image src={props.Poster} width={200} height={300} alt='movie img' />}
					<div className={styles.descr}>
						<span className={styles.text}>Title: {props.Title}</span>
						<span className={styles.text}>Year: {props.Year}</span>
						<span className={styles.text}>imdbID: {props.imdbID}</span>
						<span className={styles.text}>Type: {props.Type}</span>
					</div>
				</>
			) : (
				<div className={styles.extra}>
					<span className={styles.text}>{props.Plot}</span>
					<span className={styles.text}>IMDb: {props.imdbRating}</span>
				</div>
			)}
		</div>
	)
}

export default MovieCard
