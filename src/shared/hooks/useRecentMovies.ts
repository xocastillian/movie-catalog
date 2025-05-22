import { useEffect, useState } from 'react'
import { recentStorage } from '@/shared/utils/storage'
import { Movie } from '@/shared/types'

export const useRecentMovies = () => {
	const [recent, setRecent] = useState<Movie[]>([])

	const refresh = () => setRecent(recentStorage.getAll() as Movie[])

	useEffect(refresh, [])

	const addRecent = (movie: Movie) => {
		recentStorage.add(movie)
		refresh()
	}

	return { recent, addRecent }
}
