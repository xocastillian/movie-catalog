import { MovieWidget } from '@/widgets'

// И тут SSR, компонент просто выодит список избранных. То есть MovieWidget будет CSR, но у нас ничего больше и нет, что могло бы быть SSR внутри ProfilePage
export const ProfilePage = () => {
	return <MovieWidget localMode title='Favorites' />
}
