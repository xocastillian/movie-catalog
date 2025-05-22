import { useEffect, useState } from 'react'
import { recentStorage } from '@/shared/utils/storage'
import { MovieFull } from '@/shared/types'

export const useRecentMovies = () => {
	const [recent, setRecent] = useState<MovieFull[]>([])

	useEffect(() => {
		setRecent(recentStorage.getAll() as MovieFull[])
	}, [])

	const addRecent = (movie: MovieFull) => {
		recentStorage.add(movie)
		setRecent(recentStorage.getAll() as MovieFull[])
	}

	return { recent, addRecent }
}
