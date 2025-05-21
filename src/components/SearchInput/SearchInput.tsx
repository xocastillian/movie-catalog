import React from 'react'
import styles from './SearchInput.module.css'
import { X } from 'lucide-react'

interface SearchInputProps {
	value: string
	onChange: (value: string) => void
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
	return (
		<div className={styles.wrapper}>
			<input type='text' placeholder='Искать...' value={value} onChange={e => onChange(e.target.value)} className={styles.input} />
			{value && (
				<button className={styles.clearButton} onClick={() => onChange('')} aria-label='Очистить поиск'>
					<X size={18} />
				</button>
			)}
		</div>
	)
}

export default SearchInput
