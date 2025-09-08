<script setup>
import { ref, watch } from 'vue'
import { useFunction } from '@/composables/useFunction'

const { formatDateShort, formatCurrency } = useFunction()

const props = defineProps({
  purchaseTransactions: {
    type: Array,
    required: true,
  },
})

const transactions = ref([...props.purchaseTransactions])

watch(
  () => props.purchaseTransactions,
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
          <th class="px-2 py-2 font-medium">Total Amount</th>
          <th class="px-2 py-2 font-medium">Total Quantity</th>
          <th class="px-2 py-2 font-medium">Total Discount</th>
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
            <span class="material-symbols-outlined text-green-600"> sell </span> Purchase of
            {{ tx.totalQuantity }} products totalling {{ tx.totalAmount }}.
          </td>
          <td class="p-2 py-3">{{ formatCurrency(tx.totalAmount) }}</td>
          <td class="p-2 py-3">{{ tx.totalQuantity }}</td>
          <td class="p-2 py-3">{{ formatCurrency(tx.totalDiscount) }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="5" class="py-16 text-center text-gray-400">
            <span class="material-symbols-outlined text-5xl mb-2">shopping_cart_off</span>
            <div>No purchases found.</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
