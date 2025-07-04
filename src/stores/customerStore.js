import { defineStore } from 'pinia'
// import axios from 'axios'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [],
    customerStats: null,
  }),
  getters: {},
  actions: {
    setCustomers(customers) {
      this.customers = customers
      localStorage.setItem('customers', JSON.stringify(customers))
    },
  },
})
