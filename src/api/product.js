import apiClient from './index'

export const fetchAllProducts = () => apiClient.get('/product/all')

export const createNewProduct = (data) => apiClient.post('/product/new', data)

export const updateProductById = (id, data) => apiClient.put(`/product/${id}/update`, data)
