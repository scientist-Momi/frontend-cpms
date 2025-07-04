import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    isOpen: false,
    data: null,
    user: [],
    type: null, // e.g. 'logout', 'settings'
  }),
  actions: {
    open(type, data, user) {
      this.type = type
      this.data = data
      this.isOpen = true
      this.user = user
    },
    close() {
      this.type = null
      this.data = null
      this.user = []
      this.isOpen = false
    },
  },
})
