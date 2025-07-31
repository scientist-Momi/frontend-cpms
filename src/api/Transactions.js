import apiClient from './index'

export const fetchAllTransactions = () => apiClient.get('/customer/transaction/all')
