import { useTransactionStore } from '@/stores/TransactionStore'
import { fetchAllTransactions } from '@/api/Transactions'

export const useTransaction = () => {
  const transactionStore = useTransactionStore()

  const fetchTransactions = async () => {
    try {
      const res = await fetchAllTransactions()
      transactionStore.setTransactions(res.data.data)
      return { success: true }
    } catch (err) {
      transactionStore.setTransactions([])
      console.log('Transactions fetch failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Transactions fetch failed',
      }
    }
  }
  return {
    fetchTransactions,
  }
}
