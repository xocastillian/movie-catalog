import type { ReactNode } from 'react'
import styles from './layout.module.css'
import { Metadata } from 'next'

interface ProfileLayoutProps {
	children: ReactNode
}

export const metadata: Metadata = {
	title: 'Кино каталог | Профиль',
	description: 'Избранные фильмы',
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
	return <section className={styles.wrapper}>{children}</section>
}

export default ProfileLayout
