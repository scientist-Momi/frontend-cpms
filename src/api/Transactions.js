import apiClient from './index'

export const fetchAllTransactions = () => apiClient.get('/customer/transaction/all')

export const fetchATransaction = (id) => apiClient.get(`/customer/transaction/t/${id}`)

export const createNewTransaction = (data) => apiClient.post('/customer/transaction/new', data)

export const createNewReturn = (data) => apiClient.post('/customer/transaction/return', data)

export const fetchAllTransactionReturns = (id) => apiClient.get(`/customer/transaction/return/${id}`)
