import apiClient from './index'

export const fetchUser = () => apiClient.get('/user/me')

export const fetchAllUsers = () => apiClient.get('/user/all')

export const fetchUserById = (id) => apiClient.get(`/user/${id}`)

export const updateUserProfile = (data) => apiClient.put('/user/me/update', data)

export const updateUserPassword = (data) => apiClient.put('/user/me/password/update', data)

export const createNewUser = (data) => apiClient.post('/auth/register', data)

export const fetchUserPermissions = (id) => apiClient.get(`/user/${id}/permissions`)

export const updateUserPermissions = (id, data) =>
  apiClient.put(`/user/${id}/permission/update`, data)

export const deactivateUserById = (id) => apiClient.put(`user/${id}/enable`)

export const updateProfileById = (id, data) => apiClient.put(`/user/${id}/update`, data)

export const updatePasswordById = (id, data) => apiClient.put(`/user/${id}/password/update`, data)

export const deleteUsersById = (data) => apiClient.delete('/user/delete', { data })
