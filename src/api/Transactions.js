import apiClient from './index'

export const fetchAllTransactions = () => apiClient.get('/customer/transaction/all')

export const fetchATransaction = (id) => apiClient.get(`/customer/transaction/t/${id}`)
