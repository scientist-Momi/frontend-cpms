<script setup>
import { ref, computed } from 'vue'
import ProfileTab from '../components/ProfileTab.vue'
import PermissionsTab from '../components/PermissionsTab.vue'
import AccountSecurityTab from '../components/AccountSecurityTab.vue'
import EmailSettingsTab from '../components/EmailSettingsTab.vue'
import ActivitiesTab from '../components/ActivitiesTab.vue'
import { useModalStore } from '@/stores/modalStore'
import { useAuthStore } from '@/stores/authStore'
import TabDivider from '../components/TabDivider.vue'

const auth = useAuthStore()
const modal = useModalStore()
const activeTab = ref('profile')

const tabs = [
  { name: 'profile', label: 'Profile', icon: 'account_circle' },
  { name: 'permissions', label: 'Permissions', icon: 'passkey' },
  { name: 'settings', label: 'Email Settings', icon: 'settings' },
  { name: 'contacts', label: 'Appearance', icon: 'contacts' },
  { name: 'security', label: 'Account Security', icon: 'lock' },
  { name: 'activity', label: 'Account Activities', icon: 'view_timeline' },
]

const visibleTabs = computed(() =>
  tabs.filter((tab) => tab.name !== 'settings' || auth.user.role !== 'MINOR_ADMIN'),
)
</script>

<template>
  <div class="flex h-[82.5vh] rounded-lg bg-gray-100">
    <!-- Tabs Sidebar (20%) -->
    <div class="w-1/5 border-r border-gray-200 pt-6 pr-8 h-[82.5vh] flex flex-col">
      <ul class="flex flex-col text-sm font-medium text-gray-600" role="tablist">
        <li v-for="tab in visibleTabs" :key="tab.name" role="presentation">
          <button
            :class="[
              'flex items-center w-full px-2 py-2 rounded mx-2 my-1 transition-colors cursor-pointer',
              activeTab === tab.name ? 'bg-gray-300 text-gray-800' : 'hover:bg-gray-300 ',
            ]"
            @click="activeTab = tab.name"
            type="button"
            role="tab"
          >
            <span class="material-symbols-outlined mr-2">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </button>
        </li>
      </ul>

      <!-- Logout button at the bottom -->
      <button
        @click="modal.open('logout')"
        class="flex w-full items-center text-left gap-2 px-4 bg-red-600 text-white rounded py-2 text-sm hover:bg-red-500 cursor-pointer mt-auto font-medium"
      >
        <span class="material-symbols-outlined icon"> logout </span>
        <p>Log out</p>
      </button>
    </div>

    <!-- Tab Content (80%) -->
    <div class="w-4/5 p-6 overflow-y-auto border border-gray-200 bg-white">
      <div v-if="activeTab === 'profile'">
        <ProfileTab />
      </div>
      <div v-if="activeTab === 'permissions'">
        <PermissionsTab />
      </div>
      <div v-if="activeTab === 'settings' && auth.user.role === 'MAIN_ADMIN'">
        <EmailSettingsTab />
      </div>
      <div v-if="activeTab === 'contacts'">
        <p class="text-sm text-gray-700">
          This is the <strong class="font-medium">Contacts</strong> tab content.
        </p>
      </div>
      <div v-if="activeTab === 'security'">
        <AccountSecurityTab />
      </div>
      <div v-if="activeTab === 'activity'">
        <ActivitiesTab :user="auth.user">
          <h1 class="text-lg font-semibold">Account Events & Logs</h1>
          <p class="text-sm text-gray-500">This is how others will see you on the site.</p>
          <TabDivider />
        </ActivitiesTab>
      </div>
    </div>
  </div>
</template>
