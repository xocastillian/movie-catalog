import axios from 'axios'

export const axiosInstance = axios.create({
	baseURL: 'http://www.omdbapi.com/',
	params: {
		apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
	},
})
