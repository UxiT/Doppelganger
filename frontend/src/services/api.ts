import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')

  if (token) {
    if (!config.headers) config.headers = {}

    config.headers.Authorization = `Bearer ${token}`
  } else if (
    router.currentRoute.value.path !== '/login' ||
    router.currentRoute.value.path !== '/register'
  ) {
    router.push('/login')
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default api
