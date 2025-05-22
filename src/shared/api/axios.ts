import axios from 'axios'

const FALLBACK_API_KEY = 'abe90f5d' // Ну это только для того, чтобы вам не пришлось свой создавать)
const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || FALLBACK_API_KEY

export const axiosInstance = axios.create({
	baseURL: 'https://www.omdbapi.com/',
})

axiosInstance.interceptors.request.use(config => {
	config.params = {
		...config.params,
		apikey: API_KEY,
	}
	return config
})
