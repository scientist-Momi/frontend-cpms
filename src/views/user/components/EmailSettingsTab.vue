<script setup>
import { ref } from 'vue'
import TabDivider from './TabDivider.vue'
import { useAuthStore } from '@/stores/authStore'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useToastStore } from '@/stores/toastStore'

const auth = useAuthStore()
const toast = useToastStore()

const showStepper = ref(false)
const step = ref(1)
const newEmail = ref('')
const pin = ref('')
const sentPin = ref('')
const isLoading = ref(false)

function openStepper() {
  showStepper.value = true
  step.value = 1
  newEmail.value = ''
  pin.value = ''
  sentPin.value = ''
}

function closeStepper() {
  showStepper.value = false
  step.value = 1
  newEmail.value = ''
  pin.value = ''
  sentPin.value = ''
}

// Simulate sending PIN (replace with real API call)
function sendPin() {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.value)) {
    toast.showToast({ message: 'Please enter a valid email address.', type: 'error' })
    return
  }
  isLoading.value = true
  setTimeout(() => {
    sentPin.value = Math.floor(100000 + Math.random() * 900000).toString()
    toast.showToast({ message: `A 6-digit code has been sent to ${newEmail.value}. (Simulated: ${sentPin.value})`, type: 'success' })
    step.value = 2
    isLoading.value = false
  }, 1200)
}

// Simulate verifying PIN (replace with real API call)
function verifyPin() {
  if (pin.value !== sentPin.value) {
    toast.showToast({ message: 'Invalid code. Please try again.', type: 'error' })
    return
  }
  isLoading.value = true
  setTimeout(() => {
    // Simulate email update
    auth.user.email = newEmail.value
    toast.showToast({ message: 'Your email has been updated!', type: 'success' })
    step.value = 3
    isLoading.value = false
  }, 1200)
}
</script>

<template>
  <div class="w-3/5">
    <h1 class="text-lg font-semibold">Email Settings</h1>
    <p class="text-sm text-gray-500">This is how others will see you on the site.</p>
    <TabDivider />

    <div class="p-4 flex items-center justify-between rounded-xs border border-gray-200">
      <div>
        <h1 class="text-base font-medium text-gray-900 mb-2">Email Account</h1>
        <p class="text-sm text-gray-400">
          Your email <span class="font-medium text-gray-900">{{auth.user.email}}</span> is being used for all primary communications.
        </p>
      </div>
      <SecondaryButton @click="openStepper">
        Change Email
      </SecondaryButton>
    </div>

    <!-- Inline Stepper -->
    <div v-if="showStepper" class="mt-6 px-6 py-8 bg-white rounded-lg border border-gray-200 shadow-sm">
      <!-- Stepper Indicator -->
      <div class="flex items-center justify-center mb-8">
        <div
          v-for="n in 3"
          :key="n"
          class="flex items-center"
        >
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center font-bold',
            step >= n ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
          ]">{{ n }}</div>
          <div v-if="n < 3" class="w-8 h-1 bg-gray-300 mx-1 rounded"></div>
        </div>
      </div>

      <!-- Step 1: Enter new email -->
      <div v-if="step === 1">
        <h2 class="text-base font-semibold mb-2">Enter New Email</h2>
        <input
          type="email"
          v-model="newEmail"
          placeholder="e.g. new@email.com"
          class="w-full border border-gray-200 text-sm rounded p-2 mb-4 text-gray-900 focus:ring-red-400 focus:outline-none"
          :disabled="isLoading"
        />
        <div class="flex gap-2">
          <PrimaryButton class="w-full" :disabled="!newEmail || isLoading" @click="sendPin">
            <span v-if="!isLoading">Send Verification Code</span>
            <span v-else>Sending...</span>
          </PrimaryButton>
          <SecondaryButton @click="closeStepper" type="button">Cancel</SecondaryButton>
        </div>
      </div>

      <!-- Step 2: Enter PIN -->
      <div v-if="step === 2">
        <h2 class="text-base font-semibold mb-2">Verify Email</h2>
        <p class="mb-2 text-sm text-gray-500">Enter the 6-digit code sent to <span class="font-medium text-gray-900">{{ newEmail }}</span></p>
        <input
          type="text"
          maxlength="6"
          v-model="pin"
          placeholder="6-digit code"
          class="w-full border text-sm border-gray-200 rounded p-2 mb-4 text-gray-900 focus:ring-red-400 focus:outline-none tracking-widest text-center"
          :disabled="isLoading"
        />
        <div class="flex gap-2">
          <PrimaryButton class="w-full" :disabled="!pin || isLoading" @click="verifyPin">
            <span v-if="!isLoading">Verify & Update Email</span>
            <span v-else>Verifying...</span>
          </PrimaryButton>
          <SecondaryButton @click="closeStepper" type="button">Cancel</SecondaryButton>
        </div>
      </div>

      <!-- Step 3: Success -->
      <div v-if="step === 3" class="text-center">
        <span class="material-symbols-outlined text-green-600 text-5xl mb-4">check_circle</span>
        <h2 class="text-base font-semibold mb-2">Email Updated!</h2>
        <p class="mb-4 text-gray-600">Your email has been successfully updated to <span class="font-medium text-gray-900">{{ newEmail }}</span>.</p>
        <PrimaryButton class="w-full" @click="closeStepper">Finish</PrimaryButton>
      </div>
    </div>
  </div>
</template>
