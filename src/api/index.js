import axios from 'axios'
import router from '@/router'
import CryptoJS from 'crypto-js'

const secretKey = import.meta.env.VITE_SECRET_KEY
// import { useAuthStore } from '@/stores/authStore';
// import { useAuth } from '@/composables/useAuth';

// const auth = useAuthStore()
// const {logout} = useAuth()
// https://cpms-backend-app-aa2b15ff3bf7.herokuapp.com/

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || 'https://cpms-backend-app-aa2b15ff3bf7.herokuapp.com/v1',
    // import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/v1',
})

instance.interceptors.request.use((config) => {
  const encryptedToken = localStorage.getItem('token')
  let token = null
  if (encryptedToken) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey)
      token = bytes.toString(CryptoJS.enc.Utf8)
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      token = null
    }
  }
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('permissions')
      localStorage.removeItem('users')
      delete axios.defaults.headers.common['Authorization']
      router.push('/')
      return Promise.reject(error)
    }
    return Promise.reject(error)
  },
)

export default instance
