import apiClient from './index'

export const fetchAllProducts = () => apiClient.get('/product/all')

export const fetchProductById = (id) => apiClient.get(`/product/${id}`)

export const createNewProduct = (data) => apiClient.post('/product/new', data)

export const updateProductById = (id, data) => apiClient.put(`/product/${id}/update`, data)

export const fetchAllTransactionsOnAProduct = (id) => apiClient.get(`/customer/transaction/product/${id}`)

export const fetchProductVariants = (id) => apiClient.get(`/products/${id}/variants`)

export const createNewProductVariant = (id, data) => apiClient.post(`/products/${id}/variants`, data)

export const updateProductVariant = (id, v_id, data) => apiClient.put(`/products/${id}/variants/${v_id}`, data)

export const deleteProductVariant = (id, v_id) => apiClient.delete(`/products/${id}/variants/${v_id}`)

export const updateProductPrice = (id, data) => apiClient.post(`/product/${id}/price/update`, data)
