<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useCustomer } from '@/composables/useCustomer'
import { useProduct } from '@/composables/useProduct'
import { useTransaction } from '@/composables/useTransaction'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'

const form = reactive({ email: '', password: '' })
// const showPassword = ref(false)
const error = ref(null)
const loading = ref(false)
const loggingInType = ref(null)

const router = useRouter()
const { login, fetchUserInfo, fetchUsers, getUserActivities } = useAuth()
const { fetchCustomers, fetchCustomerTransactions } = useCustomer()
const { fetchProducts } = useProduct()
const { fetchTransactions } = useTransaction()

function autoLogin(type) {
  if (loading.value) return
  loggingInType.value = type
  if (type === 'major') {
    form.email = 'joeyrogan@gmail.com'
    form.password = 'password12345'
  } else if (type === 'minor') {
    form.email = 'gabbrown33@test.com'
    form.password = 'password123456'
  }
  handleLogin()
}

const handleLogin = async () => {
  error.value = null
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const res = await login(form)
  loading.value = false
  if (res.success) {
    router.push({ name: 'Dashboard' })
    fetchUserInfo()
    fetchUsers()
    fetchCustomers()
    fetchCustomerTransactions()
    fetchProducts()
    fetchTransactions()
    getUserActivities()
  } else {
    error.value = res.message
    loggingInType.value = null
  }
}
</script>
<template>
  <div>
    <span class="material-symbols-outlined logo mb-5"> public </span>
    <h1 class="text-[1.8rem] font-semibold mb-2 text-gray-900">Access your Qwaklan account</h1>
    <p class="text-[1rem] text-gray-400 mb-5">
      You can choose to log in as the major admin who has full access, or log in as a sub admin with
      limited access.
    </p>

    <div class="flex gap-3 mb-6">
      <PrimaryButton
        type="button"
        :disabled="loading"
        @click="autoLogin('major')"
        class="flex items-center gap-2"
      >
        <span v-if="loading && loggingInType === 'major'">
          <svg
            aria-hidden="true"
            class="inline w-5 h-5 text-gray-200 animate-spin fill-red-600"
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
          Logging in as Major Admin...
        </span>
        <span v-else>Login as Major Admin</span>
      </PrimaryButton>
      <SecondaryButton
        type="button"
        :disabled="loading"
        @click="autoLogin('minor')"
        class="flex items-center gap-2"
      >
        <span v-if="loading && loggingInType === 'minor'">
          <svg
            aria-hidden="true"
            class="inline w-5 h-5 text-red-200 animate-spin fill-red-600"
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
          Logging in as Minor Admin...
        </span>
        <span v-else>Login as Minor Admin</span>
      </SecondaryButton>
    </div>
    <div v-if="error" class="flex gap-2 items-center mt-2">
      <span class="material-symbols-outlined text-red-500"> error </span>
      <p class="text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<!-- <template>
  <span class="material-symbols-outlined logo mb-5"> public </span>
  <h1 class="text-[1.8rem] font-semibold mb-2 text-gray-900">Login into your account</h1>
  <p class="text-[1rem] text-gray-400 mb-5">
    Enter your email and your generated password to gain access to the dashboard.
  </p>

  <form @submit.prevent="showPassword ? handleLogin() : handleNext()">
    <div class="relative h-[56px] overflow-hidden mb-5">
      <Transition name="fade-slide" mode="out-in">
        <input
          v-if="!showPassword"
          type="email"
          key="email"
          v-model="form.email"
          placeholder="youremail@example.com"
          class="absolute top-0 left-0 w-full h-full border-2 border-gray-200 rounded-xs p-3 focus:ring-0 focus:outline-0"
        />
      </Transition>

      <Transition name="fade-slide" mode="out-in">
        <div v-if="showPassword">
          <input
            key="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="absolute top-0 left-0 w-full h-full border-2 border-gray-200 rounded-xs p-3 focus:ring-0 focus:outline-0"
          />
          <span
            class="material-symbols-outlined absolute right-3 top-4 cursor-pointer"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? 'visibility_off' : 'visibility' }}
          </span>
        </div>
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
</template> -->

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
