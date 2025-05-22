import { useState, useEffect } from 'react'
import { favoritesStorage } from '@/shared/utils/storage'
import { Movie } from '@/shared/types'

export const useFavorites = () => {
	const [favorites, setFavorites] = useState<Movie[]>([])

	useEffect(() => {
		setFavorites(favoritesStorage.getAll())
	}, [])

	const toggleFavorite = (movie: Movie) => {
		favoritesStorage.toggle(movie)
		setFavorites(favoritesStorage.getAll())
	}

	const isFavorite = (movie: Movie) => {
		return favorites.some(m => m.imdbID === movie.imdbID)
	}

	return { favorites, toggleFavorite, isFavorite }
}
