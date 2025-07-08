<script setup>
import { ref, watch } from 'vue'
import { useFunction } from '@/composables/useFunction'

const { formatDateShort, formatCurrency } = useFunction()

const props = defineProps({
  purchaseTransactions: {
    type: Array,
    required: true
  }
})

const transactions = ref([...props.purchaseTransactions])

watch(
  () => props.purchaseTransactions,
  (newVal) => {
    transactions.value = [...newVal]
  }
)

// const transactions = ref([
//   {
//     transactionId: 1001,
//     customerId: 'b3e1c7d2-1f3a-4c8d-8e2f-123456789abc',
//     totalAmount: '245.50',
//     totalQuantity: 5,
//     totalDiscount: '15.00',
//     createdAt: '2025-07-06T10:15:30',
//     updatedAt: '2025-07-06T10:20:00',
//   },
//   {
//     transactionId: 1002,
//     customerId: 'a7d9e8c4-2b1f-4f8e-9d3e-987654321def',
//     totalAmount: '120.00',
//     totalQuantity: 2,
//     totalDiscount: '0.00',
//     createdAt: '2025-07-05T16:40:10',
//     updatedAt: '2025-07-05T16:45:00',
//   },
//   {
//     transactionId: 1003,
//     customerId: 'c4f8e7d1-3b2a-4d9c-8e1f-abcdef123456',
//     totalAmount: '89.99',
//     totalQuantity: 1,
//     totalDiscount: '5.00',
//     createdAt: '2025-07-04T09:05:00',
//     updatedAt: '2025-07-04T09:10:00',
//   },
//   {
//     transactionId: 1004,
//     customerId: 'd1e8f7c2-4a3b-5c9d-7e2f-fedcba987654',
//     totalAmount: '350.75',
//     totalQuantity: 10,
//     totalDiscount: '25.00',
//     createdAt: '2025-07-03T13:30:45',
//     updatedAt: '2025-07-03T13:35:00',
//   },
//   {
//     transactionId: 1005,
//     customerId: 'e2f7d8c3-5b4a-6d8e-7f3c-13579bdf2468',
//     totalAmount: '60.00',
//     totalQuantity: 3,
//     totalDiscount: '0.00',
//     createdAt: '2025-07-02T17:50:20',
//     updatedAt: '2025-07-02T17:55:00',
//   },
// ])
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
      <tbody class="text-sm">
        <tr v-for="tx in transactions" :key="tx.transactionId" class="border-b border-gray-200 hover:bg-gray-50 transition">
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
    </table>
  </div>
</template>
