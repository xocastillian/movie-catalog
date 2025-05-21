'use client'

import React, { useEffect, useState } from 'react'
import MovieList, { SearchResponseStatus } from '../MovieList/MovieList'
import SearchInput from '../SearchInput/SearchInput'
import { fetchMovieById } from '@/api/fetchMovie'
import { Movie } from '@/types'
import { useMovieSearch } from '@/hooks/useMovieSearch'
import styles from './MovieWidget.module.css'
import { favoritesStorage, recentStorage } from '@/utils/storage'

interface Props {
	localMode?: boolean
}

const MovieWidget: React.FC<Props> = ({ localMode = false }) => {
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
	const [modalLoading, setModalLoading] = useState(false)

	const [recentMovies, setRecentMovies] = useState<Movie[]>([])

	const [allLocalMovies, setAllLocalMovies] = useState<Movie[]>([])
	const [filteredLocalMovies, setFilteredLocalMovies] = useState<Movie[]>([])
	const [localQuery, setLocalQuery] = useState('')

	const { query: searchQuery, setQuery: setSearchQuery, movies, isLoading, responseStatus } = useMovieSearch()

	useEffect(() => {
		setRecentMovies(recentStorage.getAll())

		if (localMode) {
			const stored = favoritesStorage.getAll()
			setAllLocalMovies(stored)
			setFilteredLocalMovies(stored)
		}
	}, [localMode])

	useEffect(() => {
		if (!localMode) return

		const trimmed = localQuery.trim().toLowerCase()
		if (!trimmed) {
			setFilteredLocalMovies(allLocalMovies)
			return
		}

		setFilteredLocalMovies(allLocalMovies.filter(movie => movie.Title.toLowerCase().includes(trimmed)))
	}, [localQuery, allLocalMovies, localMode])

	const handleSelect = async (movie: Movie) => {
		setSelectedMovie(movie)
		setModalLoading(true)

		try {
			const data = await fetchMovieById(movie.imdbID)
			const fullMovie = { ...movie, Plot: data.Plot, imdbRating: data.imdbRating }

			setSelectedMovie(fullMovie)
			recentStorage.add(fullMovie)
			setRecentMovies(recentStorage.getAll())
		} catch (e) {
			console.error(e)
		} finally {
			setModalLoading(false)
		}
	}

	const handleFavoriteToggle = () => {
		if (!localMode) return
		const updated = favoritesStorage.getAll()
		setAllLocalMovies(updated)
		setFilteredLocalMovies(localQuery.trim() ? updated.filter(movie => movie.Title.toLowerCase().includes(localQuery.trim().toLowerCase())) : updated)
	}

	return (
		<div className={styles.container}>
			{recentMovies.length > 0 && !localMode && (
				<>
					<h2 className={styles.sectionTitle}>Недавно просмотренные</h2>
					<MovieList
						movies={recentMovies}
						isLoading={false}
						selectedMovie={selectedMovie}
						modalLoading={modalLoading}
						onSelect={handleSelect}
						onCloseModal={() => setSelectedMovie(null)}
						responseStatus={SearchResponseStatus.Ok}
						isRecent
						onFavoriteToggle={handleFavoriteToggle}
					/>
				</>
			)}

			<div className={styles.searchContainer}>
				<SearchInput value={localMode ? localQuery : searchQuery} onChange={localMode ? setLocalQuery : setSearchQuery} />
				{(localMode ? localQuery : searchQuery).trim() !== '' && (
					<p className={styles.searchQuery}>
						Результаты по запросу: <span>«{localMode ? localQuery : searchQuery}»</span>
					</p>
				)}
			</div>

			<MovieList
				movies={localMode ? filteredLocalMovies : movies}
				isLoading={!localMode && isLoading}
				selectedMovie={selectedMovie}
				modalLoading={modalLoading}
				onSelect={handleSelect}
				onCloseModal={() => setSelectedMovie(null)}
				responseStatus={localMode ? (filteredLocalMovies.length ? SearchResponseStatus.Ok : SearchResponseStatus.NotFound) : responseStatus}
				onFavoriteToggle={handleFavoriteToggle}
			/>
		</div>
	)
}

export default MovieWidget
