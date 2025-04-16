import client from 'axios'

export const axios = client.create({
	baseURL: process.env.REACT_APP_API_ENDPOINT || import.meta.env.VITE_REACT_APP_API_ENDPOINT,
})

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			window.location.href = '/includes/easyload-login.html'
		}
		return Promise.reject(error)
	}
)
