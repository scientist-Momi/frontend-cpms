import apiClient from './index'; 

export const loginUser = (credentials) => apiClient.post('/auth/authenticate', credentials);