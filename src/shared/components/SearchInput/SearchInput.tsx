import React from 'react'
import styles from './SearchInput.module.css'
import { X } from 'lucide-react'

interface SearchInputProps {
	value: string
	onChange: (value: string) => void
	showQueryPreview?: boolean
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, showQueryPreview = false }) => {
	const trimmed = value.trim()

	return (
		<div className={styles.wrapperWithPreview}>
			<div className={styles.wrapper}>
				<input type='text' placeholder='Искать...' value={value} onChange={e => onChange(e.target.value)} className={styles.input} />
				{value && (
					<button className={styles.clearButton} onClick={() => onChange('')} aria-label='Очистить поиск' type='button'>
						<X size={18} />
					</button>
				)}
			</div>

			{showQueryPreview && trimmed !== '' && (
				<p className={styles.searchQuery}>
					Результаты по запросу: <span>«{trimmed}»</span>
				</p>
			)}
		</div>
	)
}

export default SearchInput
