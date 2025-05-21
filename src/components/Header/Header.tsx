'use client'

import React from 'react'
import styles from './Header.module.css'
import { User } from 'lucide-react'

const Header: React.FC = () => {
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<div className={styles.logo}>Типа лого (экспорт закрыт)</div>
				<div className={styles.icon}>
					<User size={24} />
				</div>
			</div>
		</header>
	)
}

export default Header
