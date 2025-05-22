import { useEffect, useRef } from 'react'

// Хук для горизонтального скролла колесиком мыши. Используется в блоке с недавно простмотренными фильмами
export const useHorizontalScroll = <T extends HTMLElement = HTMLDivElement>(enabled: boolean = true) => {
	const ref = useRef<T | null>(null)

	useEffect(() => {
		const el = ref.current
		if (!el || !enabled) return

		const handleWheel = (e: WheelEvent) => {
			if (e.deltaY === 0 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

			e.preventDefault()
			el.scrollLeft += e.deltaY
		}

		el.addEventListener('wheel', handleWheel, { passive: false })

		return () => {
			el.removeEventListener('wheel', handleWheel)
		}
	}, [enabled])

	return ref
}
