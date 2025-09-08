import { useAuthStore } from '@/stores/authStore'
import { loginUser } from '@/api/auth'
import {
  fetchUser,
  updateUserProfile,
  updateUserPassword,
  createNewUser,
  fetchUserPermissions,
  updateUserPermissions,
  fetchAllUsers,
  fetchUserById,
  deactivateUserById,
  updateProfileById,
  updatePasswordById,
  deleteUsersById,
  getAllUsersActivities,
  getAllUsersActivitiesById,
  fetchUserPermission
} from '@/api/user'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials)
      // console.log(res)
      const { token, permission } = res.data
      authStore.setAuth(token, permission)
      return { success: true }
    } catch (err) {
      // console.log(err)
      return { success: false, message: err.response?.data.message || 'Login failed' }
    }
  }

  const fetchUserInfo = async () => {
    authStore.pageLoading = true
    try {
      const res = await fetchUser()
      // console.log(res)
      authStore.setUser(res.data.data)
      return { success: true }
    } catch (err) {
      authStore.logout()
      router.push({ name: 'Login' })
      // console.log('User fetch failed', err)
      return { success: false, message: err.response?.data.message || 'User fetch failed' }
    } finally {
      authStore.pageLoading = false
    }
  }

  const fetchUserPermInfo = async () => {
    authStore.pageLoading = true
    try {
      const res = await fetchUserPermission()
      // console.log(res)
      authStore.setPermissions(res.data.data)
      return { success: true }
    } catch (err) {
      authStore.logout()
      router.push({ name: 'Login' })
      // console.log('User fetch failed', err)
      return { success: false, message: err.response?.data.message || 'User permissions fetch failed' }
    } finally {
      authStore.pageLoading = false
    }
  }

  const fetchUsers = async () => {
    authStore.pageLoading = true
    try {
      const res = await fetchAllUsers()
      authStore.setUsers(res.data.data)
      return { success: true }
    } catch (err) {
      authStore.setUsers([])
      // console.log('Users fetch failed', err)
      return { success: false, message: err.response?.data.message || 'Users fetch failed' }
    } finally {
      authStore.pageLoading = false
    }
  }

  const fetchUserId = async (payload) => {
    try {
      const res = await fetchUserById(payload)
      // console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      // console.log('User fetch failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'User fetch failed',
      }
    }
  }

  const updateUser = async (payload) => {
    authStore.pageLoading = true
    try {
      await updateUserProfile(payload)
      await fetchUserInfo()
      // console.log(res)
      return { success: true }
    } catch (err) {
      // console.log('User update failed', err)
      return { success: false, message: err.response?.data.message || 'User update failed' }
    } finally {
      authStore.pageLoading = false
    }
  }

  const updatePassword = async (payload) => {
    try {
      await updateUserPassword(payload)
      // console.log(res)
      return { success: true }
    } catch (err) {
      // console.log('User password update failed', err)
      return {
        success: false,
        message: err.response?.data.message || 'User password update failed',
      }
    }
  }

  const createUser = async (payload) => {
    try {
      const res = await createNewUser(payload)
      // console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      // console.log('Creation failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Creation failed',
      }
    }
  }

  const fetchPermissions = async (payload) => {
    try {
      const res = await fetchUserPermissions(payload)
      // console.log(res)
      return { success: true, data: res }
    } catch (err) {
      // console.log('Fetch failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Fetch failed',
      }
    }
  }

  const updatePermissions = async (id, payload) => {
    try {
      const res = await updateUserPermissions(id, payload)
      // console.log(res)
      return { success: true, data: res }
    } catch (err) {
      // console.log('Update failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Update failed',
      }
    }
  }

  const updateUserProfileById = async (id, payload) => {
    try {
      const res = await updateProfileById(id, payload)
      // console.log(res)
      return { success: true, data: res }
    } catch (err) {
      // console.log('User update failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'User update failed',
      }
    }
  }

  const updateUserPasswordById = async (id, payload) => {
    try {
      const res = await updatePasswordById(id, payload)
      // console.log(res)
      return { success: true, data: res }
    } catch (err) {
      // console.log('Update failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Update failed',
      }
    }
  }

  const deactivateUser = async (payload) => {
    try {
      const res = await deactivateUserById(payload)
      // console.log(res)
      return { success: true, data: res }
    } catch (err) {
      // console.log('Update failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Update failed',
      }
    }
  }

  const deleteUsers = async (payload) => {
    try {
      await deleteUsersById(payload)
      // console.log(res)
      return { success: true }
    } catch (err) {
      // console.log('Delete failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Delete failed',
      }
    }
  }

  const logout = () => {
    authStore.logout()
  }

  const getUserActivities = async (payload) => {
    try {
      const res = await getAllUsersActivities(payload)
      // console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      // console.log('Fetch failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Fetch failed',
      }
    }
  }

  const getUserActivitiesById = async (payload) => {
    try {
      const res = await getAllUsersActivitiesById(payload)
      // console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      // console.log('Fetch failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Fetch failed',
      }
    }
  }

  return {
    ...authStore,
    login,
    fetchUserInfo,
    logout,
    updateUser,
    updatePassword,
    createUser,
    fetchPermissions,
    updatePermissions,
    fetchUsers,
    fetchUserId,
    deactivateUser,
    updateUserProfileById,
    updateUserPasswordById,
    deleteUsers,
    getUserActivities,
    getUserActivitiesById,
    fetchUserPermInfo,
  }
}
