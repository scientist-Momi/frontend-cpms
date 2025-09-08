import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('Transaction', {
  state: () => ({
    transactions: [],
  }),
  getters: {},
  actions: {
    setTransactions(transactions) {
      this.transactions = transactions
      // localStorage.setItem('transactionsss', JSON.stringify(transactions))
    },
  },
})
