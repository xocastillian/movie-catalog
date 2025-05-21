import { Movie } from '@/types'

const FAVORITES_KEY = 'favorites'

export const storage = {
	get<T>(key: string): T | null {
		if (typeof window === 'undefined') return null
		try {
			const item = localStorage.getItem(key)
			return item ? (JSON.parse(item) as T) : null
		} catch {
			return null
		}
	},

	set<T>(key: string, value: T): void {
		if (typeof window === 'undefined') return
		try {
			localStorage.setItem(key, JSON.stringify(value))
		} catch {}
	},

	remove(key: string): void {
		if (typeof window === 'undefined') return
		try {
			localStorage.removeItem(key)
		} catch {}
	},

	clear(): void {
		if (typeof window === 'undefined') return
		try {
			localStorage.clear()
		} catch {}
	},
}

export const favoritesStorage = {
	getAll(): Movie[] {
		return storage.get<Movie[]>(FAVORITES_KEY) || []
	},

	isFavorite(id: string): boolean {
		return favoritesStorage.getAll().some(m => m.imdbID === id)
	},

	toggle(movie: Movie): void {
		const list = favoritesStorage.getAll()
		const exists = list.find(m => m.imdbID === movie.imdbID)

		if (exists) {
			storage.set(
				FAVORITES_KEY,
				list.filter(m => m.imdbID !== movie.imdbID)
			)
		} else {
			storage.set(FAVORITES_KEY, [...list, movie])
		}
	},
}
