<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import { useToastStore } from '@/stores/toastStore'
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import VerifyEmail from '@/components/VerifyEmail.vue'
import PermissionBox from '@/components/PermissionBox.vue'
import { useRouter } from 'vue-router'

const toast = useToastStore()
const { createUser, fetchPermissions, updatePermissions, fetchUsers } = useAuth()
const router = useRouter()

const verifyForm = ref(false)
const verified = ref(false)
const retrieveSuccess = ref(true)
const email = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const password = ref('')
const userId = ref('')

const step = ref(1)

const userPermissions = ref([])

function validateForm() {
  if (!email.value || !firstName.value || !lastName.value || !phone.value) {
    toast.showToast({
      message: 'All fields are required.',
      type: 'error',
    })
    return false
  }
  return true
}

function goToVerify() {
  if (!validateForm()) return
  verifyForm.value = true
  step.value = 2
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*'
  let pwd = ''
  for (let i = 0; i < 10; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  password.value = pwd
}

const handleSave = async () => {
  verifyForm.value = false
  verified.value = true
  step.value = 3

  generatePassword()

  const payload = {
    fullName: firstName.value + " " + lastName.value,
    email: email.value,
    phone: phone.value,
    password: password.value
  }
  const res = await createUser(payload)
  if(res.success){
    console.log('password', payload.password)
    userId.value = res.data.id
    retrievePermissions()
    toast.showToast({
      message: 'User created successfully!',
      type: 'success',
    })
  }else{
    verified.value = false
    verifyForm.value = false
    toast.showToast({
      message: res.message || 'Failed to create user.',
      type: 'error',
    })
  }

}

const retrievePermissions = async () => {
  const res = await fetchPermissions(userId.value)
  if(res.success){
    retrieveSuccess.value = false
    userPermissions.value.splice(0, userPermissions.value.length, ...(res.data.data.data || []))
    toast.showToast({
      message: 'Fetched user permissions!',
      type: 'success',
    })
  }else{
    verified.value = false
    verifyForm.value = false
    toast.showToast({
      message: res.message || 'Failed to load user permissions.',
      type: 'error',
    })
  }
}


const handleUpdate = async () => {
  const payload = {
    permissions: userPermissions.value
  }
  const res = await updatePermissions(userId.value, payload)
  if(res.success){
    toast.showToast({
      message: 'Updated user permissions!',
      type: 'success',
    })
    await fetchUsers()
    router.push({name: 'Users'})
  }else{
    verified.value = false
    verifyForm.value = false
    toast.showToast({
      message: res.message || 'Failed to update user permissions.',
      type: 'error',
    })
  }
}

function clearForm() {
  email.value = ''
  firstName.value = ''
  lastName.value = ''
  phone.value = ''
  step.value = 1
  verifyForm.value = false
  verified.value = false
}
</script>

<template>
  <div class="flex justify-between gap-2">
    <div class="w-[83%]">
      <div class="mb-4 bg-white rounded ">
        <div class="flex items-center p-4 border-b border-gray-200 gap-2">
          <span class="material-symbols-outlined"> group </span>
          <p class="font-semibold">New User Form</p>
        </div>

        <div class="p-4">
          <div class="mb-6 flex items-center gap-2">
            <div class="w-full">
              <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                v-model="firstName"
                :disabled="verifyForm || verified"
                class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
              />
            </div>
            <div class="w-full">
              <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                v-model="lastName"
                :disabled="verifyForm || verified"
                class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div class="mb-6 flex gap-2">
            <div class="w-full">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                type="text"
                id="email"
                v-model="email"
                :disabled="verifyForm || verified"
                class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
              />
              <p class="text-sm text-gray-400 mt-2">Email will be verified in the next step.</p>
            </div>
            <div class="w-full">
              <label for="phone" class="block mb-2 text-sm font-medium text-gray-900">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                v-model="phone"
                :disabled="verifyForm || verified"
                class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <PrimaryButton
              :disabled="verifyForm || verified"
              @click="goToVerify"
              class="flex items-center gap-1"
            >
              Verify Email
              <span class="material-symbols-outlined icon1"> arrow_right_alt </span>
            </PrimaryButton>
            <SecondaryButton :disabled="verifyForm || verified" type="button" @click="clearForm"
              >Clear form</SecondaryButton
            >
          </div>
        </div>
      </div>

      <div v-if="verifyForm" class="mb-4 bg-white rounded shadow border border-gray-200">
        <div class="flex items-center p-4 border-b border-gray-200 gap-2">
          <span class="material-symbols-outlined">mail</span>
          <p class="font-semibold">Verify Email</p>
        </div>
        <div class="">
          <VerifyEmail
            :email="email"
            @button-clicked="verifyForm = false"
            @button-clicked2="handleSave"
          />
        </div>
      </div>

      <div v-if="verified" class="bg-white rounded shadow border border-gray-200">
        <div class="flex items-center p-4 border-b border-gray-200 gap-2">
          <span class="material-symbols-outlined">passkey</span>
          <p class="font-semibold">User Permissions</p>
        </div>

        <div v-if="retrieveSuccess" class="flex flex-col items-center justify-center gap-2 p-8">
          <div role="status">
            <svg
              aria-hidden="true"
              class="inline w-10 h-10 text-gray-200 animate-spin fill-red-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
          <p>Saving and Fetching User permissions....</p>
        </div>

        <div v-else class="p-6">
          <PermissionBox v-model="userPermissions" :key="userId"/>
          <p class="text-sm text-gray-400 mt-2 mb-6">Tap inside box to manage permissions.</p>
          <div class="flex gap-2 items-center">
            <PrimaryButton @click="handleUpdate">Update Permissions</PrimaryButton>
            <SecondaryButton>Cancel</SecondaryButton>
          </div>

          <pre>{{ userPermissions }}</pre>
        </div>

      </div>
    </div>









    <!-- STEPPER -->
    <div
      class="w-[17%] py-7 px-8 bg-white rounded shadow border border-gray-200 flex items-center justify-center h-full"
    >
      <ol
        class="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400"
      >
        <li class="mb-10 ms-6">
          <span
            :class="[
              'absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white',
              step > 1
                ? 'bg-green-200 text-green-500'
                : step === 1
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-500',
            ]"
          >
            <template v-if="step > 1">
              <!-- Check icon for completed step -->
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 16 12"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M1 5.917 5.724 10.5 15 1.5"
                />
              </svg>
            </template>
            <template v-else>1</template>
          </span>
          <h3 :class="step === 1 ? 'text-red-600 font-bold' : 'font-medium leading-tight'">
            User Info
          </h3>
          <p class="text-sm">Enter all user correct information.</p>
        </li>
        <li class="mb-10 ms-6">
          <span
            :class="[
              'absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white',
              step > 2
                ? 'bg-green-200 text-green-500'
                : step === 2
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-500',
            ]"
          >
            <template v-if="step > 2">
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 16 12"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M1 5.917 5.724 10.5 15 1.5"
                />
              </svg>
            </template>
            <template v-else>2</template>
          </span>
          <h3 :class="step === 2 ? 'text-red-600 font-bold' : 'font-medium leading-tight'">
            Email Verification
          </h3>
          <p class="text-sm">Verify user email with 6-digit token sent to user's email.</p>
        </li>
        <li class="ms-6">
          <span
            :class="[
              'absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white',
              step === 3 ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500',
            ]"
          >
            <template v-if="step === 3"> 3 </template>
            <template v-else>3</template>
          </span>
          <h3 :class="step === 3 ? 'text-red-600 font-bold' : 'font-medium leading-tight'">
            User Permissions
          </h3>
          <p class="text-sm">Give user necessary permissions.</p>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.icon1 {
  font-size: 19px;
}
</style>
