<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { createAvatar } from '@dicebear/core'
import { micah } from '@dicebear/collection'
import { useUIStore } from '@/stores/uiStore'
import { useModalStore } from '@/stores/modalStore'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()

const modal = useModalStore()
const ui = useUIStore()
const showMenu = ref(false)

const avatar = computed(() => {
  const seed = auth.user?.fullName || 'default'
  return createAvatar(micah, { size: 36, seed }).toDataUri()
})

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.profile-menu-container')) {
    showMenu.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative profile-menu-container">
    <!-- Avatar Block (Trigger) -->
    <div
      class="flex mb-4 rounded items-center justify-between px-1 py-2 cursor-pointer hover:bg-gray-200"
      @click="toggleMenu"
    >
      <div class="flex items-center gap-2 p-1">
        <div class="bg-gray-900 rounded overflow-hidden w-8 h-8">
          <img :src="avatar" alt="Avatar" class="w-full h-full object-cover" />
        </div>

        <!-- Show text only when sidebar is expanded -->
        <div v-if="!ui.sidebarCollapsed" class="flex flex-col text-left">
          <p class="text-sm font-semibold text-gray-800">{{ auth.user?.fullName || 'Guest' }}</p>
          <small class="text-gray-500">{{auth.user?.email}}</small>
        </div>
      </div>

      <!-- Chevron icon only when expanded -->
      <span v-if="!ui.sidebarCollapsed" class="material-symbols-outlined text-gray-500">
        unfold_more
      </span>
    </div>

    <!-- Dropdown Menu -->
    <div
      v-if="showMenu"
      class="absolute pt-2 left-full bottom-4 ml-2 w-56 z-50 bg-white rounded-md shadow-lg ring-1 ring-black/5"
    >
      <div class="flex items-center gap-2 border-b border-gray-200 pb-1.5 px-2">
        <div class="bg-gray-900 rounded overflow-hidden w-8 h-8">
          <img :src="avatar" alt="Avatar" class="w-full h-full object-cover" />
        </div>

        <!-- Show text only when sidebar is expanded -->
        <div v-if="!ui.sidebarCollapsed" class="flex flex-col text-left">
          <p class="text-sm font-semibold text-gray-800">{{ auth.user?.fullName || 'Guest' }}</p>
          <small class="text-gray-500">{{auth.user?.email}}</small>
        </div>
      </div>
      <div class="py-2">
        <div class="px-1">
          <button @click="modal.open('settings')" class="flex w-full items-center gap-2 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
            <span class="material-symbols-outlined icon"> settings </span>
            <p>Account settings</p>

          </button>
        </div>
        <div class="border-b border-gray-200 mt-0.5 mb-0.5"></div>
        <div class="px-1">
          <button @click="modal.open('logout')" class="flex w-full items-center text-left gap-2 px-1 rounded py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-700 cursor-pointer">
          <span class="material-symbols-outlined icon"> logout </span>
          <p>Log out</p>
        </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-size: 24px;
}

.icon {
  font-size: 18px;
}
</style>
