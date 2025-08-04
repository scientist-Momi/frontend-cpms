<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useCustomerStore } from '@/stores/customerStore'
import { useProductStore } from '@/stores/productStore'
import { useFunction } from '@/composables/useFunction'
import StatsCard from '../components/StatsCard.vue'
import { useTransactionStore } from '@/stores/TransactionStore'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import CustomerRankingTable from '../components/CustomerRankingTable.vue'
import ProductRankingTable from '../components/ProductRankingTable.vue'

const customers = useCustomerStore()
const products = useProductStore()
const transactions = useTransactionStore()

const { formatCurrency, formatWithCommas } = useFunction()
</script>

<template>
  <div class="">
    <stats-card />

    <div class="flex gap-4 mt-4">
      <customer-ranking-table />
      <product-ranking-table />
      <!-- <div class="border border-gray-200 rounded w-full">
        <div class="flex items-center p-4 border-b border-gray-200 gap-2 justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined"> leaderboard </span>
            <p class="font-semibold">Product Ranking</p>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
