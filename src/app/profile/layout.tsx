import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import styles from './layout.module.css'

interface ProfileLayoutProps {
	children: ReactNode
}

export const generateMetadata = async (): Promise<Metadata> => {
	return {
		title: 'Movie Catalog | Profile',
		description: 'Favorite movies',
	}
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
	return <section className={styles.wrapper}>{children}</section>
}

export default ProfileLayout
