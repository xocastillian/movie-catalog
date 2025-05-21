'use client'

import React, { useEffect, useState } from 'react'
import MovieCard from '../MovieCard/MovieCard'
import MovieModal from '../MovieModal/MovieModal'
import Loader from '../Loader/Loader'
import styles from './MovieList.module.css'
import { Movie } from '@/types'
import { fetchMovieById, fetchMoviesBySearch } from '@/api/fetchMovie'
import SearchInput from '../SearchInput/SearchInput'

export enum SearchResponseStatus {
	Init,
	Ok,
	NotFound,
}

let debounceTimer: ReturnType<typeof setTimeout>

const MovieList = () => {
	const [movies, setMovies] = useState<Movie[]>([])
	const [query, setQuery] = useState('')
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [modalLoading, setModalLoading] = useState(false)
	const [responseStatus, setResponseStatus] = useState<SearchResponseStatus>(SearchResponseStatus.Init)

	useEffect(() => {
		if (!query.trim()) {
			setMovies([])
			setResponseStatus(SearchResponseStatus.Init)
			return
		}

		clearTimeout(debounceTimer)
		setIsLoading(true)

		debounceTimer = setTimeout(() => {
			fetchMoviesBySearch(query)
				.then(res => {
					if (res.length > 0) {
						setMovies(res)
						setResponseStatus(SearchResponseStatus.Ok)
					} else {
						setMovies([])
						setResponseStatus(SearchResponseStatus.NotFound)
					}
				})
				.catch(() => {
					setMovies([])
					setResponseStatus(SearchResponseStatus.NotFound)
				})
				.finally(() => {
					setIsLoading(false)
				})
		}, 500)
	}, [query])

	const handleSelect = async (movie: Movie) => {
		setSelectedMovie(movie)
		setModalLoading(true)

		try {
			const data = await fetchMovieById(movie.imdbID)
			setSelectedMovie(prev => (prev ? { ...prev, Plot: data.Plot, imdbRating: data.imdbRating } : null))
		} catch (e) {
			console.error(e)
		} finally {
			setModalLoading(false)
		}
	}

	return (
		<div className={styles.container}>
			<SearchInput value={query} onChange={setQuery} />

			{isLoading ? (
				<Loader />
			) : (
				<>
					<div className={styles.list}>
						{movies.map(movie => (
							<div key={movie.imdbID} onClick={() => handleSelect(movie)}>
								<MovieCard props={movie} />
							</div>
						))}
					</div>

					{movies.length === 0 && (
						<p className={styles.emptyText}>{responseStatus === SearchResponseStatus.NotFound ? 'Фильм не найден :(' : 'Введите название фильма'}</p>
					)}
				</>
			)}

			{selectedMovie && <MovieModal movie={selectedMovie} isLoading={modalLoading} onClose={() => setSelectedMovie(null)} />}
		</div>
	)
}

export default MovieList
