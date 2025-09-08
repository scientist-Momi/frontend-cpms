import { defineStore } from 'pinia'
// import axios from 'axios'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [],
    transactions: [],
    customerStats: null,
  }),
  getters: {
    financialSummary: (state) => {
      let totalRevenue = 0
      let outstandingDebts = 0
      let totalPaymentsReceived = 0

      state.customers.forEach(customer => {
        // Outstanding Debts: sum negative wallet balances
        if (
          customer.customerWallet &&
          typeof customer.customerWallet.balance === 'number' &&
          customer.customerWallet.balance < 0
        ) {
          outstandingDebts += Math.abs(customer.customerWallet.balance)
        }

        // Transactions for revenue and payments
        if (
          customer.customerWallet &&
          Array.isArray(customer.customerWallet.transactions)
        ) {
          customer.customerWallet.transactions.forEach(tx => {
            if (tx.transactionType === 'PURCHASE') {
              totalRevenue += Math.abs(Number(tx.amount))
            }
            if (tx.transactionType === 'DEPOSIT') {
              totalPaymentsReceived += Number(tx.amount)
            }
          })
        }
      })

      return {
        totalRevenue,
        outstandingDebts,
        totalPaymentsReceived
      }
    }
  },
  actions: {
    setCustomers(customers) {
      this.customers = customers
      // localStorage.setItem('customers', JSON.stringify(customers))
    },
    setTransactions(transactions){
      this.transactions = transactions
      // localStorage.setItem('transactions', JSON.stringify(transactions))
    }
  },
})
