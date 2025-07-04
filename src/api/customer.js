import apiClient from './index'

export const fetchAllCustomers = () => apiClient.get('/customer/all')

export const createNewCustomer = (data) => apiClient.post('/customer/new', data)
