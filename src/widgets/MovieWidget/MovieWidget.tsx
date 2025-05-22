'use client'

import styles from './MovieWidget.module.css'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { fetchMovieById } from '@/shared/api/omdb'
import { useMovieSearch } from '@/shared/hooks/useMovieSearch'
import { Movie, MovieFull, SearchResponseStatus } from '@/shared/types'
import { favoritesStorage, recentStorage } from '@/shared/utils/storage'
import { MovieList, MovieModal, SearchInput } from '@/shared/components'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'

interface Props {
	localMode?: boolean
	title?: string
}

const MovieWidget: React.FC<Props> = ({ localMode = false, title }) => {
	const [selectedMovie, setSelectedMovie] = useState<MovieFull | null>(null)
	const [modalLoading, setModalLoading] = useState(false)
	const [recentMovies, setRecentMovies] = useState<MovieFull[]>([])
	const [localQuery, setLocalQuery] = useState('')
	const [favorites, setFavorites] = useState<Movie[]>([])

	const { query: searchQuery, setQuery: setSearchQuery, movies, isLoading, responseStatus } = useMovieSearch()
	const debouncedLocalQuery = useDebouncedValue(localQuery, 500)

	useEffect(() => {
		if (!localMode) {
			setRecentMovies(recentStorage.getAll() as MovieFull[])
		} else {
			const stored = favoritesStorage.getAll()
			setFavorites(stored)
		}
	}, [localMode])

	const favoriteMovies = useMemo(() => {
		if (!localMode) return []
		const trimmed = debouncedLocalQuery.trim().toLowerCase()
		return trimmed ? favorites.filter(movie => movie.Title.toLowerCase().includes(trimmed)) : favorites
	}, [debouncedLocalQuery, favorites])

	const handleSelect = useCallback(
		async (movie: Movie) => {
			setSelectedMovie(movie as MovieFull)
			setModalLoading(true)

			try {
				const data = await fetchMovieById(movie.imdbID)
				const fullMovie = { ...movie, Plot: data.Plot, imdbRating: data.imdbRating }
				setSelectedMovie(fullMovie)
				recentStorage.add(fullMovie)
				setRecentMovies(recentStorage.getAll() as MovieFull[])
			} catch (e) {
				console.error(e)
			} finally {
				setModalLoading(false)
			}
		},
		[favorites, localMode]
	)

	const handleFavoriteToggle = useCallback(() => {
		if (!localMode) return
		const updated = favoritesStorage.getAll()
		setFavorites(updated)
	}, [favorites])

	const handleCloseModal = useCallback(() => {
		setSelectedMovie(null)
	}, [])

	const currentQuery = localMode ? localQuery : searchQuery

	const currentMovies = useMemo(() => {
		return localMode ? favoriteMovies : movies
	}, [localMode, favoriteMovies, movies])

	const currentResponse = useMemo(() => {
		return localMode ? (favoriteMovies.length > 0 ? SearchResponseStatus.Ok : SearchResponseStatus.NotFound) : responseStatus
	}, [localMode, favoriteMovies.length, responseStatus])

	return (
		<div className={styles.container}>
			{recentMovies.length > 0 && !localMode && (
				<>
					<h2 className={styles.sectionTitle}>Недавно просмотренные</h2>
					<MovieList movies={recentMovies} isLoading={false} onSelect={handleSelect} responseStatus={SearchResponseStatus.Ok} isRecent />
				</>
			)}

			<div className={styles.searchContainer}>
				<SearchInput value={currentQuery} onChange={localMode ? setLocalQuery : setSearchQuery} showQueryPreview />
			</div>

			<>
				<h2 className={styles.sectionTitle}>{title}</h2>
				<MovieList movies={currentMovies} isLoading={!localMode && isLoading} onSelect={handleSelect} responseStatus={currentResponse} />
			</>

			{selectedMovie && (
				<MovieModal movie={selectedMovie} isLoading={modalLoading} onClose={handleCloseModal} onFavoriteToggle={handleFavoriteToggle} />
			)}
		</div>
	)
}

export default MovieWidget
