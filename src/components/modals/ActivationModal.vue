<script setup>
import { useModalStore } from '@/stores/modalStore'
import { useAuth } from '@/composables/useAuth'
import { useToastStore } from '@/stores/toastStore'
const toast = useToastStore()

const { deactivateUser } = useAuth()
const modal = useModalStore()

const handleDeactivate = async () => {
  const res = await deactivateUser(modal.data)
  if (res.success) {
    toast.showToast({
      message: 'Update successful, page will reload for update after 5s.',
      type: 'success',
    })

    modal.close()
    await new Promise((resolve) => setTimeout(resolve, 5000))
    window.location.reload()
  } else {
    toast.showToast({
      message: res.message || 'Failed update.',
      type: 'error',
    })
  }
}
</script>

<template>
  <div>
    <p class="mb-4 text-sm">Please confirm your decision.</p>
    <div class="flex justify-end gap-2 text-sm">
      <button @click="modal.close()" class="px-4 py-2 rounded bg-gray-200 cursor-pointer">
        Cancel
      </button>
      <button
        @click="handleDeactivate"
        class="px-4 py-2 rounded bg-red-500 text-white cursor-pointer"
      >
        Confirm
      </button>
    </div>
  </div>
</template>
