'use client'

import React, { useEffect, useState } from 'react'
import MovieCard from '../MovieCard/MovieCard'
import styles from './MovieList.module.css'
import { Movie } from '@/types'
import { fetchMovieById, fetchMoviesBySearch } from '@/api/fetchMovie'

let debounceTimer: ReturnType<typeof setTimeout>

const MovieList = () => {
	const [movies, setMovies] = useState<Movie[]>([])
	const [expanded, setExpanded] = useState<string | null>(null)
	const [query, setQuery] = useState('')

	useEffect(() => {
		if (!query.trim()) {
			setMovies([])
			return
		}

		clearTimeout(debounceTimer)
		debounceTimer = setTimeout(() => {
			fetchMoviesBySearch(query)
				.then(setMovies)
				.catch(() => setMovies([]))
		}, 500)
	}, [query])

	const handleToggle = async (imdbID: string) => {
		if (expanded === imdbID) {
			setExpanded(null)
			return
		}

		const movie = movies.find(m => m.imdbID === imdbID)
		if (!movie?.Plot) {
			try {
				const data = await fetchMovieById(imdbID)
				setMovies(prev => prev.map(m => (m.imdbID === imdbID ? { ...m, Plot: data.Plot, imdbRating: data.imdbRating } : m)))
			} catch (e) {
				console.error(e)
			}
		}

		setExpanded(imdbID)
	}

	return (
		<div>
			<input type='text' placeholder='Search movies...' value={query} onChange={e => setQuery(e.target.value)} className={styles.searchInput} />

			<div className={styles.list}>
				{movies.map(movie => (
					<div key={movie.imdbID} onClick={() => handleToggle(movie.imdbID)}>
						<MovieCard props={{ ...movie, Plot: movie.Plot, imdbRating: movie.imdbRating }} isExpanded={expanded === movie.imdbID} />
					</div>
				))}
			</div>
		</div>
	)
}

export default MovieList
