import { useCustomerStore } from '@/stores/customerStore'
import {
  fetchAllCustomers,
  createNewCustomer,
  fetchCustomerById,
  createNewDeposit,
  fetchTransactions,
  fetchAllCustomerTransactions,
  updateCustomerById,
} from '@/api/customer'

export const useCustomer = () => {
  const customerStore = useCustomerStore()

  const fetchCustomers = async () => {
    // authStore.pageLoading = true
    try {
      const res = await fetchAllCustomers()
      customerStore.setCustomers(res.data.data)
      return { success: true }
    } catch (err) {
      customerStore.setCustomers([])
      // console.log('Customers fetch failed', err)
      return { success: false, message: err.response?.data.message || 'Customers fetch failed' }
    } finally {
      // authStore.pageLoading = false
    }
  }

  const createCustomer = async (payload) => {
    try {
      const res = await createNewCustomer(payload)
      // console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      // console.log('Creation failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Creation failed',
      }
    }
  }

  const newDeposit = async (payload) => {
    try {
      const res = await createNewDeposit(payload)
      // console.log(res)
      return { success: true, data: res }
    } catch (err) {
      // console.log('Deposit failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Deposit failed',
      }
    }
  }

  const fetchCustomerId = async (payload) => {
    try {
      const res = await fetchCustomerById(payload)
      // console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      // console.log('Customer fetch failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Customer fetch failed',
      }
    }
  }

  const fetchAllTransactions = async (payload) => {
    try {
      const res = await fetchTransactions(payload)
      // console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      // console.log('Transaction fetch failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Transaction fetch failed',
      }
    }
  }

  const fetchCustomerTransactions = async () => {
    try {
      const res = await fetchAllCustomerTransactions()
      customerStore.setTransactions(res.data.data)
      // console.log(res)
      return { success: true }
    } catch (err) {
      // console.log('Update failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Update failed',
      }
    }
  }

  const updateCustomer = async (id, payload) => {
    try {
      const res = await updateCustomerById(id, payload)
      // console.log(res)
      return { success: true, data: res }
    } catch (err) {
      // console.log('Update failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Update failed',
      }
    }
  }

  return {
    fetchCustomers,
    createCustomer,
    fetchCustomerId,
    newDeposit,
    fetchAllTransactions,
    fetchCustomerTransactions,
    updateCustomer,
  }
}
