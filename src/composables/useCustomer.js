import { useCustomerStore } from '@/stores/customerStore'
import { fetchAllCustomers, createNewCustomer } from '@/api/customer'

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
      console.log('Customers fetch failed', err)
      return { success: false, message: err.response?.data.message || 'Customers fetch failed' }
    } finally {
      // authStore.pageLoading = false
    }
  }

  const createCustomer = async (payload) => {
    try {
      const res = await createNewCustomer(payload)
      console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      console.log('Creation failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Creation failed',
      }
    }
  }

  return {
    fetchCustomers,
    createCustomer,
  }
}
