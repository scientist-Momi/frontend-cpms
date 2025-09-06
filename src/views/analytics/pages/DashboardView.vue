<script setup>
import StatsCard from '../components/StatsCard.vue'
import CustomerRankingTable from '../components/CustomerRankingTable.vue'
import ProductRankingTable from '../components/ProductRankingTable.vue'
import RecentTransactionsTable from '../components/RecentTransactionsTable.vue'
import LatestCustomersTable from '../components/LatestCustomersTable.vue'
import { useAuthStore } from '@/stores/authStore'

const store = useAuthStore()
</script>

<template>
  <div class="">
    <stats-card />

    <div class="flex gap-4 mt-4">
      <customer-ranking-table />
      <product-ranking-table />
    </div>

    <div class="flex gap-4 mt-4">
      <div class="w-[60%] border">
        <recent-transactions-table />
      </div>

      <div v-if="store.hasPermission('VIEW_CUSTOMER')" class="w-[40%] border">
        <latest-customers-table />
      </div>
    </div>
  </div>
</template>
