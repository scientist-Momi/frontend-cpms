import apiClient from './index'

export const fetchAllCustomers = () => apiClient.get('/customer/all')

export const fetchCustomerById = (id) => apiClient.get(`/customer/${id}`)

export const fetchWalletTransactions = (id) => apiClient.get(`customer/transaction/${id}`)

export const fetchTransactions = (id) => apiClient.get(`customer/transaction/${id}`)

export const fetchAllCustomerTransactions = () => apiClient.get('/customer/transaction/all')

export const createNewCustomer = (data) => apiClient.post('/customer/new', data)

export const createNewDeposit = (data) => apiClient.post('customer/wallet/deposit', data)
