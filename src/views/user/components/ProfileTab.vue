<script setup>
import TabDivider from './TabDivider.vue'
import { useAuthStore } from '@/stores/authStore'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import { computed, reactive, watch } from 'vue'
import { useToastStore } from '@/stores/toastStore'
import { useAuth } from '@/composables/useAuth'
import { useModalStore } from '@/stores/modalStore'

const toast = useToastStore()
const auth = useAuthStore()
const isReadOnly = computed(() => auth.user?.role === 'MINOR_ADMIN')
const { updateUser } = useAuth()
const modal = useModalStore()

const form = reactive({
  email: '',
  fullName: '',
  phone: '',
})

watch(
  () => auth.user,
  (user) => {
    if (user) {
      form.email = user.email || ''
      form.fullName = user.fullName || ''
      form.phone = user.phone || ''
    }
  },
  { immediate: true },
)

const resetForm = () => {
  if (auth.user) {
    form.email = auth.user.email || ''
    form.fullName = auth.user.fullName || ''
    form.phone = auth.user.phone || ''
  }
}

const isFormEmpty = computed(() => {
  if (!auth.user) return true
  return (
    (!form.fullName || form.fullName === auth.user.fullName) &&
    (!form.phone || form.phone === auth.user.phone)
  )
})

const handleUpdate = async () => {
  if (isFormEmpty.value) {
    toast.showToast({
      message: 'Please make changes before submitting.',
      type: 'error',
    })
    return
  }
  const payload = {
    fullName: form.fullName,
    phone: form.phone,
  }
  modal.close()
  const res = await updateUser(payload)
  if (res.success) {
    toast.showToast({
      message: 'Profile updated successfully!',
      type: 'success',
    })
  } else {
    toast.showToast({
      message: res.message || 'Failed to update profile.',
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="w-3/5">
    <h1 class="text-lg font-semibold">Profile</h1>
    <p class="text-sm text-gray-500">This is how others will see you on the site.</p>

    <TabDivider />

    <form @submit.prevent="handleUpdate">
      <div class="mt-4 mb-6">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
          Email Address
        </label>
        <input
          type="text"
          id="email"
          v-model="form.email"
          class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
          readonly
        />
        <p v-if="isReadOnly" class="text-sm text-gray-400 mt-2">
          Please <span class="text-gray-700">contact the administrator</span> to change your email.
        </p>
        <p v-else class="text-sm text-gray-400 mt-2">
          You can manage email address in the email settings.
        </p>
      </div>
      <div class="mb-6">
        <label for="fullname" class="block mb-2 text-sm font-medium text-gray-900">
          Name
        </label>
        <input
          type="text"
          id="fullname"
          v-model="form.fullName"
          class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
        />
        <p class="text-sm text-gray-400 mt-2">
          This is the name that will be displayed on your profile and in emails.
        </p>
      </div>
      <div class="mb-6">
        <label for="phone" class="block mb-2 text-sm font-medium text-gray-900"> Phone </label>
        <input
          type="text"
          id="phone"
          v-model="form.phone"
          class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
        />
        <p class="text-sm text-gray-400 mt-2">
          This is the phone number that would be used to contact you.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <PrimaryButton> Update Profile </PrimaryButton>
        <SecondaryButton @click="resetForm">Reset form</SecondaryButton>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
