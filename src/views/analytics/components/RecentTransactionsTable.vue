<script setup>
import { computed } from 'vue'
import { useFunction } from '@/composables/useFunction'
import { useTransactionStore } from '@/stores/TransactionStore'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const transactions = useTransactionStore()
const { formatCurrency, formatWithCommas } = useFunction()

const transactionsByRecency = computed(() => {
  return [...transactions.transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})
</script>

<template>
  <div class="border border-gray-200 rounded w-full">
    <div class="flex items-center p-4 border-b border-gray-200 gap-2 justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined"> overview </span>
        <p class="font-semibold">Latest Transactions</p>
      </div>
      <SecondaryButton @click="router.push({ name: 'Transactions' })">
        View all transactions
      </SecondaryButton>
    </div>
    <table class="w-full text-left table-auto border-collapse">
      <thead class="bg-blue-50 sticky top-0 z-10">
        <tr>
          <th class="px-4 py-3 font-semibold text-sm text-gray-700">#</th>
          <th class="px-4 py-3 font-semibold text-sm text-gray-700">Customer</th>
          <th class="px-4 py-3 font-semibold text-sm text-gray-700">Amount</th>
          <th class="px-4 py-3 font-semibold text-sm text-gray-700">Quantity</th>
          <th class="px-4 py-3 font-semibold text-sm text-gray-700">Date</th>
        </tr>
      </thead>
      <tbody v-if="transactionsByRecency.length" class="text-gray-700 text-sm">
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
      <tbody v-else>
        <tr>
          <td colspan="5" class="py-12 text-center text-gray-400">
            <span class="material-symbols-outlined text-5xl mb-2">receipt_long</span>
            <div>No recent transactions found.</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
