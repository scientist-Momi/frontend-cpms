<script setup>
import { ref } from 'vue'
// import { useAuthStore } from '@/stores/authStore'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useToastStore } from '@/stores/toastStore'

const props = defineProps({
  email: String,
})

// const auth = useAuthStore()
const toast = useToastStore()

const showStepper = ref(true)
const step = ref(1)
const newEmail = props.email
const pin = ref('')
const sentPin = ref('')
const isLoading = ref(false)

// defineExpose({ openStepper })

// function openStepper() {
//   showStepper.value = true
//   step.value = 1
//   newEmail.value = ''
//   pin.value = ''
//   sentPin.value = ''
// }

const emit = defineEmits(['buttonClicked', 'buttonClicked2'])
function closeStepper() {
  emit('buttonClicked')
  step.value = 1
  pin.value = ''
  sentPin.value = ''
}

function finishStepper(){
  emit('buttonClicked2')
}

// Simulate sending PIN (replace with real API call)
function sendPin() {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    toast.showToast({ message: 'Please enter a valid email address.', type: 'error' })
    return
  }
  isLoading.value = true
  setTimeout(() => {
    sentPin.value = Math.floor(100000 + Math.random() * 900000).toString()
    toast.showToast({ message: `A 6-digit code has been sent to ${newEmail}. (Simulated: ${sentPin.value})`, type: 'success' })
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
    // auth.user.email = newEmail
    toast.showToast({ message: 'Your email has been updated!', type: 'success' })
    step.value = 3
    isLoading.value = false
  }, 1200)
}
</script>

<template>
<div v-if="showStepper" class=" px-4 py-8">
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
        <h2 class="text-base font-semibold mb-2">Email to be Verified</h2>
        <input
          type="email"
          :value="props.email"
          placeholder="e.g. new@email.com"
          class="w-full border border-gray-200 text-sm rounded p-2 mb-4 text-gray-900 focus:ring-red-400 focus:outline-none"
          readonly
        />
        <div class="flex gap-2">
          <PrimaryButton class="" :disabled="!newEmail || isLoading" @click="sendPin">
            <span v-if="!isLoading">Send Verification Code</span>
            <span v-else>Sending...</span>
          </PrimaryButton>
          <SecondaryButton @click="closeStepper" type="button">Go Back</SecondaryButton>
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
          class="w-full border text-sm font-medium border-gray-200 rounded p-2 mb-4 text-gray-900 focus:ring-red-400 focus:outline-none tracking-widest text-center"
          :disabled="isLoading"
        />
        <div class="flex gap-2">
          <PrimaryButton class="" :disabled="!pin || isLoading" @click="verifyPin">
            <span v-if="!isLoading">Verify Code</span>
            <span v-else>Verifying...</span>
          </PrimaryButton>
          <SecondaryButton @click="closeStepper" type="button">Cancel</SecondaryButton>
        </div>
      </div>

      <!-- Step 3: Success -->
      <div v-if="step === 3" class="text-center">
        <span class="material-symbols-outlined text-green-600 text-5xl mb-4">check_circle</span>
        <h2 class="text-base font-semibold mb-2">Email Verified!</h2>
        <p class="mb-4 text-gray-600 text-sm">Your email has been successfully verified. Login details would be sent to <span class="font-medium">{{ newEmail }}</span></p>
        <PrimaryButton class="w-full" @click="finishStepper">Finish</PrimaryButton>
      </div>
    </div>
</template>

<style scoped>
</style>
