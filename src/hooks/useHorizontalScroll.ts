import { useEffect, useRef } from 'react'

export const useHorizontalScroll = <T extends HTMLElement = HTMLDivElement>(enabled = true) => {
	const ref = useRef<T>(null)

	useEffect(() => {
		const el = ref.current
		if (!el || !enabled) return

		const handleWheel = (e: WheelEvent) => {
			if (e.deltaY === 0) return
			e.preventDefault()
			el.scrollLeft += e.deltaY
		}

		el.addEventListener('wheel', handleWheel, { passive: false })
		return () => el.removeEventListener('wheel', handleWheel)
	}, [enabled])

	return ref
}
