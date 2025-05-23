import { create } from 'zustand'
import { Movie } from '@/shared/types'
import { MAX_RECENT, RECENT_KEY } from '@/shared/constants'

interface State {
	recent: Movie[]
	addRecent: (movie: Movie) => void
	clearRecent: () => void
	init: () => void
}

export const useRecentStore = create<State>((set, get) => ({
	recent: [],

	init: () => {
		if (typeof window === 'undefined') return
		try {
			const item = localStorage.getItem(RECENT_KEY)
			if (item) {
				const parsed = JSON.parse(item)
				if (Array.isArray(parsed)) set({ recent: parsed })
			}
		} catch (err) {
			console.warn('Ошибка при чтении RECENT_KEY из localStorage', err)
		}
	},

	addRecent: movie => {
		const existing = get().recent.filter(m => m.imdbID !== movie.imdbID)
		const updated = [movie, ...existing].slice(0, MAX_RECENT)
		localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
		set({ recent: updated })
	},

	clearRecent: () => {
		localStorage.removeItem(RECENT_KEY)
		set({ recent: [] })
	},
}))
