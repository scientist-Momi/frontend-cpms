<script setup>
import Sidebar from '@/components/sidebar/SidebarComponent.vue'
import DashboardHead from '@/components/DashboardHead.vue'
import BaseModal from '@/components/BaseModal.vue'
import SecondaryModal from '@/components/SecondaryModal.vue'
import { useModalStore } from '@/stores/modalStore'
import LogoutConfirmationModal from '@/components/modals/LogoutConfirmationModal.vue'
import ActivationModal from '@/components/modals/ActivationModal.vue'
import ChangePasswordModal from '@/components/modals/ChangePasswordModal.vue'
import EditProfileModal from '@/components/modals/EditProfileModal.vue'
import EditEmailModal from '@/components/modals/EditEmailModal.vue'
import DeleteUserModal from '@/components/modals/DeleteUserModal.vue'
import PrimaryModal from '@/components/PrimaryModal.vue'
import SettingsModal from '@/views/user/pages/SettingsModal.vue'
import NewDepositModal from '@/components/modals/NewDepositModal.vue'
import EditCustomerModal from '@/components/modals/EditCustomerModal.vue'
import { useAuthStore } from '@/stores/authStore'
import SidebarSkeleton from '@/components/sidebar/SidebarSkeleton.vue'

const modal = useModalStore()
const auth = useAuthStore()

</script>

<template>
  <div class="flex max-h-[100vh] bg-gray-100 text-gray-800">
    <SidebarSkeleton v-if="auth.pageLoading" />
    <Sidebar v-else />

    <div class="bg-white flex-1 rounded-l-2xl border border-gray-200">
      <DashboardHead />

      <main class="p-6 py-3 h-[92.5vh] overflow-auto">
        <template v-if="auth.pageLoading">
          <!-- Skeleton Loader -->
          <div class="animate-pulse space-y-4">
            <div class="h-8 bg-gray-200 rounded w-1/3"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="h-48 bg-gray-200 rounded"></div>
          </div>
        </template>
        <template v-else>
          <router-view />
        </template>
        <BaseModal v-if="modal.type === 'logout'">
          <template #header>Confirm Logout</template>
          <LogoutConfirmationModal></LogoutConfirmationModal>
        </BaseModal>
        <BaseModal v-if="modal.type === 'activate'">
          <template #header>Confirm Activation or Deactivativation of User</template>
          <ActivationModal></ActivationModal>
        </BaseModal>

        <SecondaryModal v-if="modal.type === 'settings'">
          <template #header>Settings</template>
          <SettingsModal></SettingsModal>
        </SecondaryModal>
        <PrimaryModal v-if="modal.type === 'user_password'">
          <template #header>Change Password</template>
          <ChangePasswordModal></ChangePasswordModal>
        </PrimaryModal>
        <PrimaryModal v-if="modal.type === 'user_profile'">
          <template #header>Edit Profile</template>
          <EditProfileModal></EditProfileModal>
        </PrimaryModal>
        <PrimaryModal v-if="modal.type === 'user_email'">
          <template #header>Change Email</template>
          <EditEmailModal></EditEmailModal>
        </PrimaryModal>
        <PrimaryModal v-if="modal.type === 'user_delete'">
          <template #header>Delete User(s)</template>
          <DeleteUserModal></DeleteUserModal>
        </PrimaryModal>
        <PrimaryModal v-if="modal.type === 'new_deposit'">
          <template #header>New Deposit</template>
          <NewDepositModal />
        </PrimaryModal>
        <PrimaryModal v-if="modal.type === 'customer_profile'">
          <template #header>Edit Customer Profile</template>
          <EditCustomerModal />
        </PrimaryModal>
      </main>
    </div>
  </div>
</template>
