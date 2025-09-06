<script setup>
import { useModalStore } from '@/stores/modalStore'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()
const router = useRouter()
const modal = useModalStore()

const handleLogout = () => {
    logout()
    modal.close()
    router.push("/")
}

</script>

<template>
  <div>
    <p class="mb-4 text-sm">Are you sure you want to logout?</p>
    <div class="flex justify-end gap-2 text-sm">
      <button @click="modal.close()" class="px-4 py-2 rounded bg-gray-200 cursor-pointer">Cancel</button>
      <button @click="handleLogout" class="px-4 py-2 rounded bg-red-500 text-white cursor-pointer">Logout</button>
    </div>
  </div>
</template>
