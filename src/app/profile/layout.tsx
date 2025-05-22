import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import styles from './layout.module.css'

interface ProfileLayoutProps {
	children: ReactNode
}

export const generateMetadata = async (): Promise<Metadata> => {
	return {
		title: 'Кино каталог | Профиль',
		description: 'Избранные фильмы',
	}
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
	return <section className={styles.wrapper}>{children}</section>
}

export default ProfileLayout
