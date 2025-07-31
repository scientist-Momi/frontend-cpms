import { useTransactionStore } from '@/stores/TransactionStore'
import { fetchAllTransactions, fetchATransaction } from '@/api/Transactions'

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

  const fetchTransaction = async (payload) => {
    try {
      const res = await fetchATransaction(payload)
      console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      console.log('Transaction fetch failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Transaction fetch failed',
      }
    }
  };
  return {
    fetchTransactions,
    fetchTransaction,
  }
}
