import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import { useCustomer } from '@/composables/useCustomer'
import { useProduct } from '@/composables/useProduct'
import { useTransaction } from '@/composables/useTransaction'
import CryptoJS from 'crypto-js'

const secretKey = import.meta.env.VITE_SECRET_KEY

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    pageLoading: false,
    user: null,
    permissions: [],
    users: [],
    activities: [],
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setAuth(token, permissions) {
      this.token = token
      this.permissions = permissions
      const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString()
      localStorage.setItem('token', encryptedToken)

      // localStorage.setItem('permissions', JSON.stringify(permissions))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    setUser(user) {
      this.user = user
      // localStorage.setItem('user', JSON.stringify(user))
    },
    setUsers(users) {
      this.users = users
      // localStorage.setItem('users', JSON.stringify(users))
    },
    setPermissions(permissions) {
      this.permissions = permissions
    },
    setActivities(activities) {
      this.activities = activities
    },
    // loadStoredAuth() {
    //   const { fetchUserInfo, fetchUserPermInfo, fetchUsers, getUserActivities } = useAuth()
    //   const { fetchCustomers, fetchCustomerTransactions } = useCustomer()
    //   const { fetchProducts } = useProduct()
    //   const { fetchTransactions } = useTransaction()
    //   const bytes = CryptoJS.AES.decrypt(localStorage.getItem('token'), secretKey)
    //   const token = bytes.toString(CryptoJS.enc.Utf8)
    //   const permissions = this.permissions
    //   const user = this.user
    //   if (token) {
    //     this.token = token
    //     this.permissions = permissions
    //     this.user = user
    //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    //     if (this.token && !this.user) {
    //       fetchUserInfo()
    //       fetchUserPermInfo()
    //       fetchUsers()
    //       fetchCustomers()
    //       fetchCustomerTransactions()
    //       fetchProducts()
    //       fetchTransactions()
    //       getUserActivities()
    //     }
    //   }
    // },
    loadStoredAuth() {
      const encryptedToken = localStorage.getItem('token')
      if (!encryptedToken) {
        this.token = null
        this.user = null
        this.permissions = []
        delete axios.defaults.headers.common['Authorization']
        return
      }
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey)
        const token = bytes.toString(CryptoJS.enc.Utf8)
        if (token) {
          this.token = token
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          // Optionally, fetch user and permissions from API if not already set
          if (!this.user) {
            const { fetchUserInfo, fetchUserPermInfo, fetchUsers, getUserActivities } = useAuth()
            const { fetchCustomers, fetchCustomerTransactions } = useCustomer()
            const { fetchProducts } = useProduct()
            const { fetchTransactions } = useTransaction()
            fetchUserInfo()
            fetchUserPermInfo()
            fetchUsers()
            fetchCustomers()
            fetchCustomerTransactions()
            fetchProducts()
            fetchTransactions()
            getUserActivities()
          }
        } else {
          this.token = null
          this.user = null
          this.permissions = []
          delete axios.defaults.headers.common['Authorization']
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        this.token = null
        this.user = null
        this.permissions = []
        delete axios.defaults.headers.common['Authorization']
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
