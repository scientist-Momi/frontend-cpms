<script setup>
import { useModalStore } from '@/stores/modalStore'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/composables/useAuth'
import { computed } from 'vue'
import { useToastStore } from '@/stores/toastStore'
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'

const modal = useModalStore()
const auth = useAuthStore()
const toast = useToastStore()
const {deleteUsers, fetchUsers} = useAuth()
const users = auth.users

const usersToDelete = computed(() => {
  if (!Array.isArray(modal.user)) return []
  return users.filter((u) => modal.user.includes(u.id))
})

const handleDelete = async () => {
  const payload = modal.user
  const res = await deleteUsers(payload)
  if (res.success) {
    await fetchUsers()
    toast.showToast({ message: 'User(s) deleted!', type: 'success' })
    modal.close()
  } else {
    toast.showToast({ message: res.message || 'Delete failed.', type: 'error' })
  }
}
</script>

<template>
  <div class="bg-white h-full">
    <div class="p-6">
      <p class="mb-4">You are about to delete all users below.</p>
      <div class="max-h-48 border border-gray-200 shadow overflow-auto flex flex-wrap gap-2 p-2 mb-4">

          <div class="border border-gray-200 shadow-sm p-1" v-for="user in usersToDelete" :key="user.id">
            {{ user.fullName }}
          </div>

      </div>

      <div class="flex items-center gap-2">
        <PrimaryButton @click="handleDelete">Confirm</PrimaryButton>
        <SecondaryButton @click="modal.close()">Cancel</SecondaryButton>
      </div>
    </div>

  </div>
</template>

<style scoped></style>
