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

const transactionsByRecency = computed(() => {
  return [...transactions.transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const recentCustomers = computed(() => {
  return [...customers.customers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})
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

    <div class="flex gap-4 mt-4">
      <div class="w-[60%] border">
        <div class="border border-gray-200 rounded w-full">
          <div class="flex items-center p-4 border-b border-gray-200 gap-2 justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined"> overview </span>
              <p class="font-semibold">Latest Transactions</p>
            </div>
            <SecondaryButton @click="toggleRanking"> View all </SecondaryButton>
          </div>
          <table class="w-full text-left table-auto border-collapse mt-4">
            <thead class="bg-blue-50 sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3 font-semibold text-sm text-gray-700">#</th>
                <th class="px-4 py-3 font-semibold text-sm text-gray-700">Customer</th>
                <th class="px-4 py-3 font-semibold text-sm text-gray-700">Amount</th>
                <th class="px-4 py-3 font-semibold text-sm text-gray-700">Quantity</th>
                <th class="px-4 py-3 font-semibold text-sm text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody class="text-gray-700 text-sm">
              <tr
                v-for="(tx, index) in transactionsByRecency"
                :key="tx.transactionId"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                class="hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <td class="px-4 py-3 font-medium text-center">{{ index + 1 }}</td>
                <td class="px-4 py-3">{{ tx.customerName }}</td>
                <td class="px-4 py-3">{{ formatCurrency(tx.totalAmount) }}</td>
                <td class="px-4 py-3">{{ formatWithCommas(tx.totalQuantity) }}</td>
                <td class="px-4 py-3">{{ new Date(tx.createdAt).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="w-[40%] border">
        <div class="border border-gray-200 rounded w-full">
          <div class="flex items-center p-4 border-b border-gray-200 gap-2 justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined"> acute </span>
              <p class="font-semibold">Latest Customers</p>
            </div>
            <SecondaryButton @click="toggleRanking"> View all </SecondaryButton>
          </div>
          <table class="w-full text-left table-auto border-collapse mt-4">
            <thead class="bg-blue-50 sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3 font-semibold text-sm text-gray-700">#</th>
                <th class="px-4 py-3 font-semibold text-sm text-gray-700">Name</th>
                <th class="px-4 py-3 font-semibold text-sm text-gray-700">Email</th>
                <th class="px-4 py-3 font-semibold text-sm text-gray-700">Date Joined</th>
              </tr>
            </thead>
            <tbody class="text-gray-700 text-sm">
              <tr
                v-for="(customer, index) in recentCustomers"
                :key="customer.id"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                class="hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <td class="px-4 py-3 font-medium text-center">{{ index + 1 }}</td>
                <td class="px-4 py-3">{{ customer.name }}</td>
                <td class="px-4 py-3">{{ customer.email }}</td>
                <td class="px-4 py-3">{{ new Date(customer.createdAt).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
