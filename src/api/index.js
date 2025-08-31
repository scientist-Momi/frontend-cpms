import axios from 'axios';
import router from '@/router';
// import { useAuthStore } from '@/stores/authStore';
// import { useAuth } from '@/composables/useAuth';

// const auth = useAuthStore()
// const {logout} = useAuth()

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/v1',
});

// Add Authorization header if token exists
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('permissions')
      localStorage.removeItem('users')
      delete axios.defaults.headers.common['Authorization']
      router.push('/login')
      return Promise.reject(error)
    }
    return Promise.reject(error)
  },
)

export default instance;

