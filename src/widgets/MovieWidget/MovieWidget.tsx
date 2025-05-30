'use client'

import styles from './MovieWidget.module.css'
import { MovieModal, MovieList, SearchInput, Loader } from '@/shared/components'
import { Movie, SearchResponseStatus } from '@/shared/types'
import { useMovieWidgetLogic } from '@/shared/hooks/useMovieWidgetLogic'

interface Props {
	localMode?: boolean
	title?: string
	initialMovies?: Movie[]
}

/**
 * MovieWidget рендерится на клиенте (Client-Side Rendering), потому что он объявлен с директивой `'use client'`, а также использует:
 * - хуки React
 * - пользовательские хуки с доступом к `localStorage`, Zustand и React Query
 * - взаимодействие с DOM через `ref` и `IntersectionObserver`
 * - модальное окно, зависящее от кликов и локального состояния
 *
 * Такой подход необходим, потому что:
 * - компонент динамически реагирует на пользовательский ввод и действия
 * - часть данных хранится в локальных хранилищах (`favorites`, `recent`)
 * - нужна интерактивность (модалка, поиск, избранное, бесконечная прокрутка).
 *
 * В целом, все что вложено в него, так же будет CSR, работает клайнт баундаринг
 */

const MovieWidget: React.FC<Props> = ({ localMode = false, title, initialMovies = [] }) => {
	const {
		currentQuery,
		setQuery,
		setLocalQuery,
		selectedMovie,
		modalLoading,
		handleSelect,
		handleCloseModal,
		currentMovies,
		currentResponse,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		observerRef,
		recent,
		toggleFavorite,
		isFavorite,
	} = useMovieWidgetLogic(initialMovies, localMode)

	const isSearchInactive = localMode || !currentQuery.trim()

	return (
		<div className={styles.container}>
			{recent.length > 0 && !localMode && (
				<>
					<h2 className={styles.sectionTitle}>Recently watched</h2>
					<MovieList movies={recent} isLoading={false} onSelect={handleSelect} responseStatus={SearchResponseStatus.Ok} isRecent />
				</>
			)}

			<div className={styles.searchContainer}>
				<SearchInput value={currentQuery} onChange={localMode ? setLocalQuery : setQuery} showQueryPreview />
			</div>

			{isSearchInactive && <h2 className={styles.sectionTitle}>{title}</h2>}

			<MovieList movies={currentMovies} isLoading={isLoading} onSelect={handleSelect} responseStatus={currentResponse} />

			{hasNextPage && !localMode && (
				<>
					{isFetchingNextPage && <Loader />}
					<div ref={observerRef} className={styles.scrollObserver} />
				</>
			)}

			{selectedMovie && (
				<MovieModal
					movie={selectedMovie}
					isLoading={modalLoading}
					onClose={handleCloseModal}
					onFavoriteToggle={() => toggleFavorite(selectedMovie)}
					isFavorite={isFavorite(selectedMovie)}
				/>
			)}
		</div>
	)
}

export default MovieWidget
