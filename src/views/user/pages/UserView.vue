<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { createAvatar } from '@dicebear/core'
import { micah } from '@dicebear/collection'
import TabDivider from '../components/TabDivider.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import PermissionBox from '@/components/PermissionBox.vue'
import { useAuth } from '@/composables/useAuth'
import { useToastStore } from '@/stores/toastStore'
import PageLoader from '@/components/PageLoader.vue'
import ActivitiesTab from '../components/ActivitiesTab.vue'
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()
const { fetchPermissions, updatePermissions, fetchUserId } = useAuth()
const toast = useToastStore()
const route = useRoute()
const userId = computed(() => Number(route.params.id))

const userPermissions = ref([])
const permissionsLoading = ref(false)

// Find the user from the auth store
// const user = computed(() =>
//   return auth.users.find((u) => u.id === userId.value)
// })

const user = ref(null)

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const res = await fetchUserId(userId.value)
  await retrievePermissions()
  user.value = res.data
})

// watch(
//   () => userId.value,
//   async (newId) => {
//     if (newId) {
//       permissionsLoading.value = true
//       await new Promise((resolve) => setTimeout(resolve, 2500))
//       await retrievePermissions(newId)
//       permissionsLoading.value = false
//     }
//   },
//   { immediate: true },
// )

const retrievePermissions = async () => {
  const res = await fetchPermissions(userId.value)
  if (res.success) {
    userPermissions.value.splice(0, userPermissions.value.length, ...(res.data.data.data || []))
    toast.showToast({
      message: 'Fetched user permissions!',
      type: 'success',
    })
  } else {
    userPermissions.value = []
    toast.showToast({
      message: res.message || 'Failed to load user permissions.',
      type: 'error',
    })
  }
}

const handlePermissionsUpdate = async () => {
  permissionsLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const payload = {
    permissions: userPermissions.value,
  }
  const res = await updatePermissions(userId.value, payload)
  if (res.success) {
    userPermissions.value.splice(0, userPermissions.value.length, ...(res.data.data.data || []))
    toast.showToast({
      message: 'Updated user permissions!',
      type: 'success',
    })
  } else {
    toast.showToast({
      message: res.message || 'Failed to update user permissions.',
      type: 'error',
    })
  }
  permissionsLoading.value = false
}

const avatar = computed(() => {
  const userTouse = user.value
  const seed = userTouse.fullName || 'default'
  return createAvatar(micah, { size: 36, seed }).toDataUri()
})

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const activeTab = ref('permissions')
</script>

<template>
  <div class="flex justify-between gap-4">
    <div class="w-[45%]">
      <div class="border border-gray-200 rounded p-4 shadow mb-4">
        <div v-if="user">
          <div class="flex justify-between items-start gap-6 mb-6">
            <!-- Avatar -->
            <div class="bg-gray-900 rounded overflow-hidden w-32 h-32 shadow flex-shrink-0">
              <img :src="avatar" alt="Avatar" class="w-full h-full object-cover" />
            </div>

            <!-- Status and Actions -->
            <div class="flex items-center gap-3">
              <div
                v-if="!user.enabled"
                class="bg-red-100 text-red-700 font-semibold px-3 py-1 rounded text-sm shadow-sm"
              >
                Deactivated
              </div>
              <div
                v-else
                class="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded text-sm shadow-sm"
              >
                Active
              </div>
              <SecondaryButton @click="modal.open('user_profile', null, user)"
                >Edit Profile</SecondaryButton
              >
            </div>
          </div>

          <div class="flex gap-4 items-center mb-2">
            <h1 class="font-semibold text-2xl">{{ user.fullName }}</h1>
            <div class="">
              <span
                class="material-symbols-outlined text-red-600 hover:bg-gray-200 cursor-pointer p-1 rounded-full"
                :title="`Message ${user.fullName}`"
                role="button"
                tabindex="0"
              >
                outgoing_mail
              </span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Email</p>
              <h1 class="font-semibold text-base">{{ user.email }}</h1>
            </div>
            <SecondaryButton @click="modal.open('user_email')">Change Email</SecondaryButton>
          </div>
          <TabDivider />
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-gray-500 text-sm">Phone</p>
            </div>
            <h1 class="font-semibold text-base">{{ user.phone }}</h1>
          </div>
          <TabDivider />
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-gray-500 text-sm">Created At</p>
            </div>
            <h1 class="font-semibold text-base">{{ formatDate(user.createdAt) }}</h1>
          </div>
        </div>
        <PageLoader v-else />
      </div>

      <div class="border border-gray-200 rounded shadow">
        <div class="flex items-center gap-2 border-b border-gray-200 p-4">
          <span class="material-symbols-outlined"> action_key </span>
          <p class="font-semibold">Actions</p>
        </div>
        <div v-if="user" class="p-4">
          <div
            v-if="user.enabled"
            class="p-3 flex items-center justify-between rounded-xs border border-red-200 mb-4"
          >
            <div>
              <h1 class="text-base font-medium text-gray-900 mb-2">Deactivate User</h1>
              <p class="text-sm text-gray-400">
                This action deactivates user account.
                <span class="font-medium text-gray-900">{{ user.fullName }}</span> would be unable
                to access the account anymore after deactivation.
              </p>
            </div>
            <PrimaryButton @click="modal.open('activate', userId)"> Deactivate </PrimaryButton>
          </div>
          <div
            v-else
            class="p-3 flex items-center gap-2 justify-between rounded-xs border border-green-200 mb-4"
          >
            <div>
              <h1 class="text-base font-medium text-gray-900 mb-2">Re-activate User</h1>
              <p class="text-sm text-gray-400">
                This action re-activates user account.
                <span class="font-medium text-gray-900">{{ user.fullName }}</span> would be able to
                access the account after re-activation.
              </p>
            </div>
            <PrimaryButton @click="modal.open('activate', userId)"> Activate </PrimaryButton>
          </div>
          <div
            class="p-3 flex items-center gap-2 justify-between rounded-xs border border-gray-200"
          >
            <div>
              <h1 class="text-base font-medium text-gray-900 mb-2">Update User Password</h1>
              <p class="text-sm text-gray-400">
                Update user password. Option to send new password to user email is given.
              </p>
            </div>
            <PrimaryButton @click="modal.open('user_password', userId)"> Update </PrimaryButton>
          </div>
        </div>
        <PageLoader v-else />
      </div>
    </div>

    <div class="w-[55%] border border-gray-200 rounded shadow">
      <div class="mb-4 border-b border-gray-200">
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          <li class="me-2" role="presentation">
            <button
              :class="[
                'p-4 border-b-2 rounded-t-lg font-semibold flex items-center transition-colors cursor-pointer',
                activeTab === 'permissions'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300',
              ]"
              type="button"
              role="tab"
              aria-selected="activeTab === 'permissions'"
              @click="activeTab = 'permissions'"
            >
              <span class="material-symbols-outlined mr-2">passkey</span>
              Permissions
            </button>
          </li>
          <li class="me-2" role="presentation">
            <button
              :class="[
                'flex items-center transition-colors cursor-pointer p-4 border-b-2 rounded-t-lg font-semibold',
                activeTab === 'activities'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300',
              ]"
              type="button"
              role="tab"
              aria-selected="activeTab === 'activities'"
              @click="activeTab = 'activities'"
            >
              <span class="material-symbols-outlined mr-2">view_timeline</span>
              Activities
            </button>
          </li>
        </ul>
      </div>
      <div>
        <div v-show="activeTab === 'permissions'" role="tabpanel">
          <PageLoader
            v-if="!userPermissions || userPermissions.length === 0 || permissionsLoading"
          />
          <div v-else class="px-4">
            <PermissionBox v-model="userPermissions" :key="userId" />
            <p class="text-sm text-gray-400 mt-2 mb-6">Tap inside box to manage permissions.</p>
            <div class="flex gap-2 items-center">
              <PrimaryButton
                :disabled="!userPermissions || userPermissions.length === 0"
                @click="handlePermissionsUpdate"
              >
                Update Permissions
              </PrimaryButton>
              <SecondaryButton @click="retrievePermissions">Reset</SecondaryButton>
            </div>
          </div>
        </div>
        <div v-show="activeTab === 'activities'" class="pl-14 flex-1 overflow-auto" role="tabpanel">
          <ActivitiesTab class="h-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
