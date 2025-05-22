import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/shared/components'
import QueryProvider from '@/shared/providers/queryProvider'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
	display: 'swap',
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Кино каталог | Главная',
	description: 'Тестовое задание Uppercase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='ru' className={`${geistSans.variable} ${geistMono.variable}`}>
			<body className='min-h-screen bg-[#0d0d0d] text-white'>
				<QueryProvider>
					<Header />
					<main className='px-4 pb-10'>{children}</main>
				</QueryProvider>
			</body>
		</html>
	)
}
