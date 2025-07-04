<script setup>
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'
import { useModalStore } from '@/stores/modalStore'
import { useAuth } from '@/composables/useAuth'
import { useToastStore } from '@/stores/toastStore'
import { watch, reactive } from 'vue'

const toast = useToastStore()
const {updateUserProfileById } = useAuth()
const modal = useModalStore()

const form = reactive({
  fullName: '',
  phone: ''
})

watch(
  () => modal.user,
  (user) => {
    if (user) {
      form.fullName = user.fullName || ''
      form.phone = user.phone || ''
    }
  },
  { immediate: true }
)

const handleUpdateProfile = async () => {
  const payload = {
    fullName: form.fullName,
    phone: form.phone
  }
  const res = await updateUserProfileById(modal.user.id, payload)
  if (res.success) {

    window.location.reload()

    toast.showToast({ message: 'Profile updated!', type: 'success' })
    modal.close()
  } else {
    toast.showToast({ message: res.message || 'Update failed.', type: 'error' })
  }
}

const resetForm = () => {
  if (modal.user) {
    form.fullName = modal.user.fullName || ''
    form.phone = modal.user.phone || ''
  }
}
</script>


<template>
  <div class="bg-white h-full">
    <div class="p-6">
      <div class="mb-6">
        <label for="fullname" class="block mb-2 text-sm font-medium text-gray-900">Name</label>
        <input
          type="text"
          id="fullname"
          v-model="form.fullName"
          class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
        />
        <p class="text-sm text-gray-400 mt-2">
          This is the name that will be displayed on user's profile and in emails.
        </p>
      </div>
      <div class="mb-6">
        <label for="phone" class="block mb-2 text-sm font-medium text-gray-900">Phone</label>
        <input
          type="text"
          id="phone"
          v-model="form.phone"
          class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
        />
        <p class="text-sm text-gray-400 mt-2">
          This is the phone number that would be used to contact user.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <PrimaryButton @click="handleUpdateProfile">Update Profile</PrimaryButton>
        <SecondaryButton @click="resetForm">Reset form</SecondaryButton>
      </div>
    </div>
  </div>
</template>
