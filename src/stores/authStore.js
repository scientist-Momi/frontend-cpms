import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import { useCustomer } from '@/composables/useCustomer'
import { useProduct } from '@/composables/useProduct'
import { useTransaction } from '@/composables/useTransaction'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    pageLoading: false,
    user: null,
    permissions: [],
    users: [],
    activities: []
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setAuth(token, permissions) {
      this.token = token
      this.permissions = permissions
      localStorage.setItem('token', token)

      localStorage.setItem('permissions', JSON.stringify(permissions))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    setUser(user){
      this.user = user
      // localStorage.setItem('user', JSON.stringify(user))
    },
    setUsers(users){
      this.users = users
      // localStorage.setItem('users', JSON.stringify(users))
    },
    loadStoredAuth() {
      const { fetchUserInfo, fetchUsers, getUserActivities } = useAuth()
      const {fetchCustomers, fetchCustomerTransactions} = useCustomer()
      const { fetchProducts } = useProduct()
      const { fetchTransactions } = useTransaction()
      const token = localStorage.getItem('token')
      const permissions = JSON.parse(localStorage.getItem('permissions')) || []
      const user = this.user
      if (token) {
        this.token = token
        this.permissions = permissions
        this.user = user
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        if (this.token && !this.user) {
          fetchUserInfo()
          fetchUsers()
          fetchCustomers()
          fetchCustomerTransactions()
          fetchProducts()
          fetchTransactions()
          getUserActivities()
        }
      }
    },
    logout() {
      this.user = null
      this.token = null
      this.permissions = []
      this.users = []
      localStorage.removeItem('token')
      localStorage.removeItem('permissions')
      localStorage.removeItem('users')
      delete axios.defaults.headers.common['Authorization']
    },
    hasPermission(permission) {
      return this.permissions.includes(permission)
    },
  },
})
