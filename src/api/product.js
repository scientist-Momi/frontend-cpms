import apiClient from './index'

export const fetchAllProducts = () => apiClient.get('/product/all')
