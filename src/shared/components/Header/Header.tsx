import React from 'react'
import styles from './Header.module.css'
import { User } from 'lucide-react'
import Link from 'next/link'

const Header: React.FC = () => {
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<Link href='/' className={styles.logo}>
					<span>Типа лого</span>
				</Link>

				<nav className={styles.nav}>
					<Link href='/profile' className={styles.icon} aria-label='Профиль'>
						<User size={24} />
					</Link>
				</nav>
			</div>
		</header>
	)
}

export default Header
