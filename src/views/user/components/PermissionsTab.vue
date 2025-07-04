<script setup>
import TabDivider from './TabDivider.vue'
import { useAuthStore } from '@/stores/authStore'
import { PERMISSION_GROUPS } from '@/constants/permissions'
import { computed } from 'vue'

const auth = useAuthStore()

const groupedUserPermissions = computed(() =>
  PERMISSION_GROUPS.map((group) => ({
    group: group.group,
    permissions: group.permissions.filter((perm) => auth.permissions.includes(perm.key)),
  })).filter((group) => group.permissions.length > 0),
)

const isReadOnly = computed(() => auth.user?.role === 'MINOR_ADMIN')
</script>

<template>
  <div class="w-3/5">
    <h1 class="text-lg font-semibold">Permissions</h1>
    <p class="text-sm text-gray-500">
      Below are the list of actions you can perform on this app.
      <span v-if="isReadOnly">Contact the administrator for any enquiry.</span>
    </p>
    <TabDivider />

    <div v-for="group in groupedUserPermissions" :key="group.group" class="mb-8">
      <h2 class="text-sm font-medium text-gray-900 mt-6 mb-2 border-b border-gray-200 pb-1">
        {{ group.group }}
      </h2>
      <table class="min-w-full border border-gray-900 rounded-lg overflow-hidden">
        <tbody>
          <tr
            v-for="perm in group.permissions"
            :key="perm.key"
            class="border-t border-gray-200 text-sm text-gray-500"
          >
            <td class="px-0 py-2">{{ perm.label }}</td>
            <td class="px-0 py-2">
              <span
                class="px-3 py-1 rounded-xs bg-red-100 text-red-700 text-xs font-medium shadow-sm border border-red-200"
              >
                {{ perm.key }}
              </span>
            </td>
            <td class="px-0 py-2">{{ perm.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
