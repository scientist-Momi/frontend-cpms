import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
  }),
  getters: {},
  actions: {
    setProducts(products) {
      this.products = products
      // localStorage.setItem('products', JSON.stringify(products))
    },
  },
})
