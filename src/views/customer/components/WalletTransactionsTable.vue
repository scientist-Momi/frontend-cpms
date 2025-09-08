<script setup>
import { ref, watch } from 'vue'
import { useFunction } from '@/composables/useFunction'
// Accept walletTransactions as a prop
const props = defineProps({
  walletTransactions: {
    type: Array,
    required: true,
  },
})

const { formatDateShort, formatCurrency } = useFunction()

const transactions = ref([...props.walletTransactions])

// Keep local copy in sync if prop changes
watch(
  () => props.walletTransactions,
  (newVal) => {
    transactions.value = [...newVal]
  },
)
</script>

<template>
  <div class="px-14">
    <table class="w-full text-left">
      <thead class="text-xs border-b border-gray-200">
        <tr>
          <th class="px-2 py-2 font-medium">Date</th>
          <th class="px-2 py-2 font-medium">Description</th>
          <th class="px-2 py-2 font-medium text-right">Amount</th>
          <th class="px-2 py-2 font-medium text-right">Type</th>
          <th class="px-2 py-2 font-medium text-right">Balance After</th>
        </tr>
      </thead>
      <tbody v-if="transactions.length" class="text-sm">
        <tr
          v-for="tx in transactions"
          :key="tx.transactionId"
          class="border-b border-gray-200 hover:bg-gray-50 transition"
        >
          <td class="p-2 py-3">{{ formatDateShort(tx.createdAt) }}</td>
          <td class="p-2 py-3 flex items-center gap-1">
            <!-- <span class="material-symbols-outlined text-green-600"> sell </span> -->
            {{ tx.reference }}
          </td>
          <td class="p-2 py-3 text-right">{{ formatCurrency(tx.amount) }}</td>
          <td class="p-2 py-3 text-right flex justify-end">
            <div
              v-if="tx.transactionType === 'PURCHASE'"
              class="flex items-center gap-0.5 bg-red-200 text-red-600 w-fit text-xs font-semibold rounded px-2 py-1"
            >
              <span class="material-symbols-outlined"> call_made </span>
              {{ tx.transactionType }}
            </div>
            <div
              v-else
              class="flex items-center gap-0.5 bg-green-200 text-green-600 w-fit text-xs font-semibold rounded px-2 py-1"
            >
              <span class="material-symbols-outlined"> call_received </span>
              {{ tx.transactionType }}
            </div>
          </td>
          <td class="p-2 py-3 text-right">{{ formatCurrency(tx.balanceAfterTransaction) }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="5" class="py-16 text-center text-gray-400">
            <span class="material-symbols-outlined text-5xl mb-2">account_balance_wallet</span>
            <div>No wallet transactions found.</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-size: 18px;
}
</style>
