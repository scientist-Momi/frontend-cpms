import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    isOpen: false,
    data: null,
    user: [],
    type: null,
    refreshNeeded: false,
  }),
  actions: {
    open(type, data, user) {
      this.type = type
      this.data = data
      this.isOpen = true
      this.user = user
      this.refreshNeeded = false
    },
    close() {
      this.type = null
      this.data = null
      this.user = []
      this.isOpen = false
      this.refreshNeeded = true
    },
  },
})
