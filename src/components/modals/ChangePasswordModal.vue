<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import { ref } from 'vue'
import { useToastStore } from '@/stores/toastStore'
import { useAuth } from '@/composables/useAuth'
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()

const { updateUserPasswordById } = useAuth()

const toast = useToastStore()

const newPassword = ref('')

function resetForm() {
  newPassword.value = ''
}

function validateForm() {
  if (!newPassword.value) {
    toast.showToast({
      message: 'All fields are required.',
      type: 'error',
    })
    return false
  }
  if (newPassword.value.length < 8) {
    toast.showToast({
      message: 'Password must be at least 8 characters.',
      type: 'error',
    })
    return false
  }
  return true
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*'
  let pwd = ''
  for (let i = 0; i < 10; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  newPassword.value = pwd
}

// Copy password to clipboard and show toast
async function copyPassword() {
  if (newPassword.value) {
    await navigator.clipboard.writeText(newPassword.value)
    toast.showToast({
      message: 'Password copied to clipboard!',
      type: 'success',
    })
  } else {
    toast.showToast({
      message: 'No password to copy.',
      type: 'warning',
    })
  }
}

async function handleSave() {
  if (!validateForm()) return
  const payload = {
    newPassword: newPassword.value,
  }
  const res = await updateUserPasswordById(modal.data, payload)
  if (res.success) {
    toast.showToast({
      message: 'Password updated successfully!',
      type: 'success',
    })
    resetForm()
    modal.close()
  } else {
    toast.showToast({
      message: res.message || 'Failed to update password.',
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="bg-white h-full">
    <div class="p-6">
      <div class="mb-6">
        <label for="newPassword" class="block mb-2 text-sm font-medium text-gray-900">
          New Password
        </label>
        <div class="flex gap-2">
          <input
            type="text"
            id="newPassword"
            v-model="newPassword"
            class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
            autocomplete="off"
          />
          <SecondaryButton title="Copy Password" type="button" @click="copyPassword">
            <span class="material-symbols-outlined m1 text-red-600"> content_copy </span>
          </SecondaryButton>
          <SecondaryButton title="Generate Unique Password" type="button" @click="generatePassword">
            <span class="material-symbols-outlined m1 text-red-600"> enhanced_encryption </span>
          </SecondaryButton>
        </div>
      </div>
      <div class="flex mb-6">
        <div class="flex items-center h-5">
          <input
            id="helper-checkbox"
            aria-describedby="helper-checkbox-text"
            type="checkbox"
            value=""
            class="w-4 h-4 text-red-600 bg-gray-100 border-red-300 rounded-sm focus:ring-red-500 cursor-pointer focus:outline-red-500"
          />
        </div>
        <div class="ms-2 text-sm">
          <label for="helper-checkbox" class="block mb-1 text-sm font-medium text-gray-900"
            >Send password to user email</label
          >
          <p id="helper-checkbox-text" class="text-xs font-normal text-gray-400">
            New password can be sent to user email.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <PrimaryButton @click="handleSave"> Save Changes </PrimaryButton>
        <SecondaryButton type="button" @click="resetForm">Clear form</SecondaryButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
