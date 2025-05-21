'use client'

import React, { useEffect, useState } from 'react'
import MovieCard from '../MovieCard/MovieCard'
import styles from './MovieList.module.css'
import { Movie } from '@/types'
import { fetchMovieById, fetchMoviesBySearch } from '@/api/fetchMovie'
import MovieModal from '../MovieModal/MovieModal'

let debounceTimer: ReturnType<typeof setTimeout>

const MovieList = () => {
	const [movies, setMovies] = useState<Movie[]>([])
	const [query, setQuery] = useState('')
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
	const [isLoading, setIsLoading] = useState(false)

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

	const handleSelect = async (movie: Movie) => {
		setSelectedMovie(movie)
		setIsLoading(true)

		try {
			const data = await fetchMovieById(movie.imdbID)
			setSelectedMovie(prev => (prev ? { ...prev, Plot: data.Plot, imdbRating: data.imdbRating } : null))
		} catch (e) {
			console.error(e)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div>
			<input type='text' placeholder='Search movies...' value={query} onChange={e => setQuery(e.target.value)} className={styles.searchInput} />

			<div className={styles.list}>
				{movies.map(movie => (
					<div key={movie.imdbID} onClick={() => handleSelect(movie)}>
						<MovieCard props={movie} />
					</div>
				))}
			</div>

			{selectedMovie && <MovieModal movie={selectedMovie} isLoading={isLoading} onClose={() => setSelectedMovie(null)} />}
		</div>
	)
}

export default MovieList
