'use client'

import styles from './MovieWidget.module.css'
import { useEffect, useState, useMemo } from 'react'
import { fetchMovieById } from '@/shared/api/omdb'
import { useMovieSearch } from '@/shared/hooks/useMovieSearch'
import { Movie, MovieFull, SearchResponseStatus } from '@/shared/types'
import { favoritesStorage, recentStorage } from '@/shared/utils/storage'
import { MovieList } from '../MovieList'
import { SearchInput } from '../SearchInput'

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

	useEffect(() => {
		if (!localMode) {
			setRecentMovies(recentStorage.getAll() as MovieFull[])
		} else {
			const stored = favoritesStorage.getAll()
			setFavorites(stored)
		}
	}, [localMode])

	const filteredLocalMovies = useMemo(() => {
		if (!localMode) return []
		const trimmed = localQuery.trim().toLowerCase()
		return trimmed ? favorites.filter(movie => movie.Title.toLowerCase().includes(trimmed)) : favorites
	}, [localMode, localQuery, favorites])

	const handleSelect = async (movie: Movie) => {
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
	}

	const handleFavoriteToggle = () => {
		if (!localMode) return
		const updated = favoritesStorage.getAll()
		setFavorites(updated)
	}

	const currentQuery = localMode ? localQuery : searchQuery
	const currentMovies = localMode ? filteredLocalMovies : movies
	const currentResponse = localMode ? (currentMovies.length ? SearchResponseStatus.Ok : SearchResponseStatus.NotFound) : responseStatus

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
				<SearchInput value={currentQuery} onChange={localMode ? setLocalQuery : setSearchQuery} />

				{currentQuery.trim() !== '' && (
					<p className={styles.searchQuery}>
						Результаты по запросу: <span>«{currentQuery}»</span>
					</p>
				)}
			</div>

			<>
				<h2 className={styles.sectionTitle}>{title}</h2>
				<MovieList
					movies={currentMovies}
					isLoading={!localMode && isLoading}
					selectedMovie={selectedMovie}
					modalLoading={modalLoading}
					onSelect={handleSelect}
					onCloseModal={() => setSelectedMovie(null)}
					responseStatus={currentResponse}
					onFavoriteToggle={handleFavoriteToggle}
				/>
			</>
		</div>
	)
}

export default MovieWidget
