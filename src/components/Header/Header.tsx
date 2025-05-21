import React from 'react'
import styles from './Header.module.css'
import { User } from 'lucide-react'
import Link from 'next/link'

const Header: React.FC = () => {
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<Link href='/' className={styles.logo}>
					Типа лого (экспорт закрыт)
				</Link>
				<Link href='/profile' className={styles.icon}>
					<User size={24} />
				</Link>
			</div>
		</header>
	)
}

export default Header
