'use client'

import styles from './MovieWidget.module.css'
import { useState, useMemo, useCallback } from 'react'
import { useMovieSearch } from '@/shared/hooks/useMovieSearch'
import { useFavorites } from '@/shared/hooks/useFavorites'
import { useRecentMovies } from '@/shared/hooks/useRecentMovies'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { fetchMovieById } from '@/shared/api/omdb'
import { Movie, SearchResponseStatus } from '@/shared/types'
import { MovieList, MovieModal, SearchInput } from '@/shared/components'
import { useQueryClient } from '@tanstack/react-query'
import { STALE_TIME } from '@/shared/constants'

interface Props {
	localMode?: boolean
	title?: string
	initialMovies?: Movie[]
}

const MovieWidget: React.FC<Props> = ({ localMode = false, title, initialMovies = [] }) => {
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
	const [modalLoading, setModalLoading] = useState(false)
	const [localQuery, setLocalQuery] = useState('')
	const { favorites, toggleFavorite, isFavorite } = useFavorites()
	const { recent, addRecent } = useRecentMovies()
	const { query: searchQuery, setQuery: setSearchQuery, movies, isLoading, responseStatus } = useMovieSearch()
	const queryClient = useQueryClient()
	const currentQuery = localMode ? localQuery : searchQuery
	const debouncedQuery = useDebouncedValue(currentQuery, 500)
	const isSearchActive = !!searchQuery.trim()

	const currentMovies = useMemo(() => {
		const q = debouncedQuery.trim().toLowerCase()

		if (localMode) return q ? favorites.filter(m => m.Title.toLowerCase().includes(q)) : favorites
		if (isSearchActive) return movies

		return initialMovies
	}, [localMode, favorites, debouncedQuery, isSearchActive, movies, initialMovies])

	const currentResponse = useMemo(() => {
		if (localMode) return currentMovies.length ? SearchResponseStatus.Ok : SearchResponseStatus.NotFound
		if (isSearchActive) return responseStatus

		return SearchResponseStatus.Ok
	}, [localMode, currentMovies, isSearchActive, responseStatus])

	const handleSelect = useCallback(
		async (movie: Movie) => {
			setSelectedMovie(movie)
			setModalLoading(true)

			try {
				const full = await queryClient.fetchQuery({
					queryKey: ['movie', movie.imdbID],
					queryFn: () => fetchMovieById(movie.imdbID),
					staleTime: STALE_TIME,
				})

				const fullMovie = { ...movie, ...full }
				setSelectedMovie(fullMovie)
				addRecent(fullMovie)
			} catch (e) {
				console.error(e)
			} finally {
				setModalLoading(false)
			}
		},
		[addRecent, queryClient]
	)

	const handleCloseModal = useCallback(() => {
		setSelectedMovie(null)
	}, [])

	return (
		<div className={styles.container}>
			{recent.length > 0 && !localMode && (
				<>
					<h2 className={styles.sectionTitle}>Recently watched</h2>
					<MovieList movies={recent} isLoading={false} onSelect={handleSelect} responseStatus={SearchResponseStatus.Ok} isRecent />
				</>
			)}

			<div className={styles.searchContainer}>
				<SearchInput value={currentQuery} onChange={localMode ? setLocalQuery : setSearchQuery} showQueryPreview />
			</div>

			{(localMode || !isSearchActive) && <h2 className={styles.sectionTitle}>{title}</h2>}

			<MovieList movies={currentMovies} isLoading={isLoading} onSelect={handleSelect} responseStatus={currentResponse} />

			{selectedMovie && (
				<MovieModal
					movie={selectedMovie}
					isLoading={modalLoading}
					onClose={handleCloseModal}
					onFavoriteToggle={() => toggleFavorite(selectedMovie)}
					isFavorite={isFavorite(selectedMovie)}
				/>
			)}
		</div>
	)
}

export default MovieWidget
