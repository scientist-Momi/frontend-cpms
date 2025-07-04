<script setup>
import { ref } from 'vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import TabDivider from './TabDivider.vue'
import { useToastStore } from '@/stores/toastStore'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/composables/useAuth'

const { updatePassword } = useAuth()
const auth = useAuthStore()
const toast = useToastStore()
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

function resetForm() {
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

function validateForm() {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
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
  if (newPassword.value !== confirmPassword.value) {
    toast.showToast({
      message: 'Passwords do not match.',
      type: 'error',
    })
    return false
  }
  return true
}

// Generate a 10-character unique password
function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*'
  let pwd = ''
  for (let i = 0; i < 10; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  newPassword.value = pwd
  confirmPassword.value = pwd
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
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value
  }
  const res = await updatePassword(payload)
  if (res.success) {
    toast.showToast({
      message: 'Password updated successfully!',
      type: 'success',
    })
    resetForm()
  } else {
    toast.showToast({
      message: res.message || 'Failed to update password.',
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="w-3/5">
    <h1 class="text-lg font-semibold">Manage Password</h1>
    <p class="text-sm text-gray-500">
      Reset your current password. Password set is used during login.
    </p>

    <TabDivider />

    <form @submit.prevent="handleSave">
      <div class="mt-4 mb-6">
        <label for="oldPassword" class="block mb-2 text-sm font-medium text-gray-900">
          Current Password
        </label>
        <input
          type="text"
          id="oldPassword"
          v-model="oldPassword"
          class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
        />
        <p class="text-sm text-gray-400 mt-2">This is your current password.</p>
      </div>
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
        <p class="text-sm text-gray-400 mt-2">This is your new password. Make sure you copy your password before saving changes.</p>
      </div>
      <div class="mb-6">
        <label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-900">
          Confirm Password
        </label>
        <input
          type="text"
          id="confirmPassword"
          v-model="confirmPassword"
          class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
        />
        <p class="text-sm text-gray-400 mt-2">Confirm your new password to proceed.</p>
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
            >Send password to my email</label
          >
          <p id="helper-checkbox-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">
            Your new password can be sent to your email
            <span class="font-semibold text-red-600">{{ auth.user.email }}</span
            >.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <PrimaryButton type="submit"> Save Changes </PrimaryButton>
        <SecondaryButton type="button" @click="resetForm">Reset form</SecondaryButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.m1 {
  font-size: 18px;
}
</style>
