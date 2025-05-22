import { Movie } from '@/shared/types'
import { FAVORITES_KEY, MAX_RECENT, RECENT_KEY } from '../constants'

// Базовая обёртка над localStorage
export const storage = {
	get<T>(key: string): T | null {
		if (typeof window === 'undefined') return null
		try {
			const item = localStorage.getItem(key)
			return item ? (JSON.parse(item) as T) : null
		} catch (err) {
			console.warn(`Ошибка при чтении ключа "${key}" из localStorage`, err)
			return null
		}
	},

	set<T>(key: string, value: T): void {
		if (typeof window === 'undefined') return
		try {
			localStorage.setItem(key, JSON.stringify(value))
		} catch (err) {
			console.warn(`Ошибка при записи ключа "${key}" в localStorage`, err)
		}
	},

	remove(key: string): void {
		if (typeof window === 'undefined') return
		try {
			localStorage.removeItem(key)
		} catch (err) {
			console.warn(`Ошибка при удалении ключа "${key}" из localStorage`, err)
		}
	},

	clear(): void {
		if (typeof window === 'undefined') return
		try {
			localStorage.clear()
		} catch (err) {
			console.warn('Ошибка при очистке localStorage', err)
		}
	},
}

// Избранные фильмы
export const favoritesStorage = {
	getAll(): Movie[] {
		return storage.get<Movie[]>(FAVORITES_KEY) ?? []
	},

	isFavorite(id: string): boolean {
		return favoritesStorage.getAll().some(movie => movie.imdbID === id)
	},

	toggle(movie: Movie): void {
		const list = favoritesStorage.getAll()
		const exists = list.find(m => m.imdbID === movie.imdbID)

		const updated = exists ? list.filter(m => m.imdbID !== movie.imdbID) : [...list, movie]

		storage.set(FAVORITES_KEY, updated)
	},

	clear(): void {
		storage.remove(FAVORITES_KEY)
	},
}

// Недавно просмотренные
export const recentStorage = {
	getAll(): Movie[] {
		return storage.get<Movie[]>(RECENT_KEY) ?? []
	},

	add(movie: Movie): void {
		const existing = recentStorage.getAll().filter(m => m.imdbID !== movie.imdbID)
		const updated = [movie, ...existing].slice(0, MAX_RECENT)
		storage.set(RECENT_KEY, updated)
	},

	clear(): void {
		storage.remove(RECENT_KEY)
	},
}
