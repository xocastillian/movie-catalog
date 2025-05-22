import { useState, useEffect } from 'react'
import { favoritesStorage } from '@/shared/utils/storage'
import { Movie } from '@/shared/types'

export const useFavorites = () => {
	const [favorites, setFavorites] = useState<Movie[]>([])

	const refresh = () => setFavorites(favoritesStorage.getAll())

	useEffect(refresh, [])

	const toggleFavorite = (movie: Movie) => {
		favoritesStorage.toggle(movie)
		refresh()
	}

	const isFavorite = (movie: Movie) => favorites.some(m => m.imdbID === movie.imdbID)

	return { favorites, toggleFavorite, isFavorite }
}
