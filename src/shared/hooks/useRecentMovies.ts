import { useEffect, useState } from 'react'
import { recentStorage } from '@/shared/utils/storage'
import { MovieFull } from '@/shared/types'

export const useRecentMovies = () => {
	const [recent, setRecent] = useState<MovieFull[]>([])

	const refresh = () => setRecent(recentStorage.getAll() as MovieFull[])

	useEffect(refresh, [])

	const addRecent = (movie: MovieFull) => {
		recentStorage.add(movie)
		refresh()
	}

	return { recent, addRecent }
}
