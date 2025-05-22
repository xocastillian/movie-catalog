import axios from 'axios'

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY

if (!API_KEY) {
	throw new Error('Отсутствует или неверный OMDb API ключ.')
}

export const axiosInstance = axios.create({
	baseURL: 'https://www.omdbapi.com/',
	params: {
		apikey: API_KEY,
	},
})
