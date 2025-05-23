import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useFavorites } from '@/shared/hooks/useFavorites'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { useQueryClient } from '@tanstack/react-query'
import { useRecentStore } from '@/shared/store/useRecentStore'
import { fetchMovieById } from '@/shared/api/omdb'
import { STALE_TIME } from '@/shared/constants'
import { Movie, SearchResponseStatus } from '@/shared/types'
import { useInfiniteMovieSearch } from './useInfiniteMovieSearch'

const useIntersectionObserver = (ref: React.RefObject<HTMLElement | null>, callback: () => void, enabled: boolean) => {
	useEffect(() => {
		const node = ref.current
		if (!node || !enabled) return
		const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && callback(), {
			threshold: 1.0,
		})
		observer.observe(node)
		return () => observer.disconnect()
	}, [ref, callback, enabled])
}

export const useMovieWidgetLogic = (initialMovies: Movie[], localMode: boolean) => {
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
	const [modalLoading, setModalLoading] = useState(false)
	const [query, setQuery] = useState('')
	const [localQuery, setLocalQuery] = useState('')
	const { favorites, toggleFavorite, isFavorite } = useFavorites()
	const queryClient = useQueryClient()
	const { recent, addRecent, init } = useRecentStore()
	const observerRef = useRef<HTMLDivElement | null>(null)

	useEffect(init, [])

	const rawQuery = localMode ? localQuery : query
	const debouncedQuery = useDebouncedValue(rawQuery, 500)
	const isSearchEnabled = !localMode && !!debouncedQuery.trim()

	const { movies, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, responseStatus } = useInfiniteMovieSearch(
		localMode ? '' : debouncedQuery
	)

	const currentMovies = useMemo(() => {
		if (localMode) {
			const q = rawQuery.trim().toLowerCase()
			return q ? favorites.filter(m => m.Title.toLowerCase().includes(q)) : favorites
		}
		return isSearchEnabled ? movies : initialMovies
	}, [localMode, favorites, rawQuery, isSearchEnabled, movies, initialMovies])

	const currentResponse = useMemo(() => {
		if (localMode) return currentMovies.length ? SearchResponseStatus.Ok : SearchResponseStatus.NotFound
		if (isSearchEnabled) return responseStatus
		return SearchResponseStatus.Ok
	}, [localMode, currentMovies, isSearchEnabled, responseStatus])

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
				setSelectedMovie({ ...movie, ...full })
				addRecent({ ...movie, ...full })
			} catch (e) {
				console.error(e)
			} finally {
				setModalLoading(false)
			}
		},
		[queryClient, addRecent]
	)

	const handleCloseModal = useCallback(() => setSelectedMovie(null), [])

	useIntersectionObserver(observerRef, fetchNextPage, hasNextPage && !isLoading && !isFetchingNextPage && isSearchEnabled && !localMode)

	return {
		currentQuery: rawQuery,
		setQuery,
		setLocalQuery,
		selectedMovie,
		modalLoading,
		handleSelect,
		handleCloseModal,
		currentMovies,
		currentResponse,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		observerRef,
		recent,
		toggleFavorite,
		isFavorite,
	}
}
