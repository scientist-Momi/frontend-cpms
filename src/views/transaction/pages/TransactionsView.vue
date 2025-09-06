<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import TransactionsTable from '../components/TransactionsTable.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const store = useAuthStore()
const router = useRouter()
</script>

<template>
  <div>
    <div v-if="$route.name === 'Transactions'">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">Customers Transaction Overview</h1>
        <div class="flex items-center gap-2">
          <div v-if="store.hasPermission('VIEW_CUSTOMER')">
            <PrimaryButton
              @click="router.push({ name: 'NewTransaction' })"
              class="flex items-center gap-2"
            >
              <span class="material-symbols-outlined"> box_add </span>
              <p>New Purchase</p>
            </PrimaryButton>
          </div>
        </div>
      </div>
      <TransactionsTable />
    </div>
    <router-view />
  </div>
</template>
