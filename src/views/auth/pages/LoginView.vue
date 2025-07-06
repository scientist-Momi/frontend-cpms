<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useCustomer } from '@/composables/useCustomer'

const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const error = ref(null)
const loading = ref(false)

const router = useRouter()
const { login, fetchUserInfo, fetchUsers } = useAuth()
const { fetchCustomers } = useCustomer()

const handleNext = () => {
  error.value = null
  if (!form.email.trim()) {
    error.value = 'Email is required'
    return
  }
  showPassword.value = true
}

const handleLogin = async () => {
  error.value = null
  loading.value = true
  const res = await login(form)
  loading.value = false
  if (res.success) {
    router.push({name: 'Dashboard'})
    fetchUserInfo()
    fetchUsers()
    fetchCustomers()
  } else {
    error.value = res.message
  }
}

</script>

<template>
  <!-- <AuthLayout> -->
    <span class="material-symbols-outlined logo  mb-5"> public </span>
    <h1 class="text-[1.8rem] font-semibold mb-2 text-gray-900">Login into your account</h1>
    <p class="text-[1rem] text-gray-400 mb-5">
      Enter your email and your generated password to gain access to the dashboard.
    </p>

    <form @submit.prevent="showPassword ? handleLogin() : handleNext()">
      <!-- Fixed-height wrapper to keep layout stable -->
      <div class="relative h-[56px] overflow-hidden mb-5">
        <!-- Email input transition -->
        <Transition name="fade-slide" mode="out-in">
          <input
            v-if="!showPassword"
            key="email"
            v-model="form.email"
            placeholder="youremail@example.com"
            class="absolute top-0 left-0 w-full h-full border-2 border-gray-200 rounded-xs p-3 focus:ring-0 focus:outline-0"
          />
        </Transition>

        <!-- Password input transition -->
        <Transition name="fade-slide" mode="out-in">
          <input
            v-if="showPassword"
            key="password"
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="absolute top-0 left-0 w-full h-full border-2 border-gray-200 rounded-xs p-3 focus:ring-0 focus:outline-0"
          />
        </Transition>
      </div>

      <button
        type="submit"
        class="w-full bg-gray-800 text-white rounded-md p-3 flex justify-center gap-1 mb-4 cursor-pointer hover:bg-gray-700"
        :disabled="loading"
      >
        <span class="font-bold">{{ showPassword ? 'Login' : 'Next' }}</span>
        <span class="material-symbols-outlined"> arrow_right_alt </span>
      </button>

      <div v-if="error" class="flex gap-2 items-center mt-2">
        <span class="material-symbols-outlined text-red-500"> error </span>
        <p class="text-red-500">{{ error }}</p>
      </div>
    </form>
  <!-- </AuthLayout> -->
</template>

<style scoped>
.logo {
  font-size: 2.7rem;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
