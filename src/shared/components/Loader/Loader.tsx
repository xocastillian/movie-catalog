import React from 'react'
import styles from './Loader.module.css'
import clsx from 'clsx'

type LoaderProps = {
	size?: number
	fullscreen?: boolean
	className?: string
}

const Loader: React.FC<LoaderProps> = ({ size = 48, fullscreen = false, className }) => {
	return (
		<div className={clsx(styles.loadingContainer, fullscreen && styles.fullscreen, className)}>
			<div className={styles.spinner} style={{ width: size, height: size, borderWidth: size / 12 }} />
		</div>
	)
}

export default Loader
