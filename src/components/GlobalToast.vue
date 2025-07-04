<!-- components/GlobalToast.vue -->
<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="[
          'w-72 p-4 rounded-lg shadow-md text-sm flex items-start space-x-2 animate-slide-up-fade',
          toast.type === 'success' ? 'bg-green-100 text-green-800' :
          toast.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        ]"
      >
        <span class="material-symbols-outlined text-lg">
          {{ getIcon(toast.type) }}
        </span>
        <span class="flex-1">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toastStore'
const toastStore = useToastStore()

const getIcon = (type) => {
  return type === 'success'
    ? 'check_circle'
    : type === 'error'
    ? 'error'
    : 'info'
}
</script>

<style scoped>
@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up-fade {
  animation: slide-up-fade 0.3s ease-out;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
</style>
