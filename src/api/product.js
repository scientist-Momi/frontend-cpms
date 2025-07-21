import apiClient from './index'

export const fetchAllProducts = () => apiClient.get('/product/all')

export const fetchProductById = (id) => apiClient.get(`/product/${id}`)

export const createNewProduct = (data) => apiClient.post('/product/new', data)

export const updateProductById = (id, data) => apiClient.put(`/product/${id}/update`, data)

export const fetchAllTransactionsOnAProduct = (id) => apiClient.get(`/customer/transaction/product/${id}`)
