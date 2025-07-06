<script setup>
import { ref } from 'vue'
import { useFunction } from '@/composables/useFunction'

const { formatDateShort, formatCurrency } = useFunction()

const transactions = ref([
  {
    transactionId: 2001,
    amount: '150.00',
    balanceAfterTransaction: '1200.50',
    transactionType: 'CREDIT',
    reference: 'INV-1001',
    description: 'Invoice payment received',
    createdAt: '2025-07-06T09:15:30',
  },
  {
    transactionId: 2002,
    amount: '50.00',
    balanceAfterTransaction: '1150.50',
    transactionType: 'DEBIT',
    reference: 'WD-2002',
    description: 'Withdrawal to bank',
    createdAt: '2025-07-05T14:22:10',
  },
  {
    transactionId: 2003,
    amount: '200.00',
    balanceAfterTransaction: '1350.50',
    transactionType: 'CREDIT',
    reference: 'TRF-3003',
    description: 'Transfer from savings',
    createdAt: '2025-07-04T11:40:00',
  },
  {
    transactionId: 2004,
    amount: '25.75',
    balanceAfterTransaction: '1324.75',
    transactionType: 'DEBIT',
    reference: 'PUR-4004',
    description: 'Purchase at store',
    createdAt: '2025-07-03T18:05:45',
  },
  {
    transactionId: 2005,
    amount: '100.00',
    balanceAfterTransaction: '1424.75',
    transactionType: 'CREDIT',
    reference: 'DEP-5005',
    description: 'Deposit by cash',
    createdAt: '2025-07-02T08:50:20',
  },
])
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
      <tbody class="text-sm">
        <tr v-for="tx in transactions" :key="tx.transactionId" class="border-b border-gray-200 hover:bg-gray-50 transition">
          <td class="p-2 py-3">{{ formatDateShort(tx.createdAt) }}</td>
          <td class="p-2 py-3 flex items-center gap-1">
            <!-- <span class="material-symbols-outlined text-green-600"> sell </span> -->
            {{ tx.description }}
          </td>
          <td class="p-2 py-3 text-right">{{ formatCurrency(tx.amount) }}</td>
          <td class="p-2 py-3 text-right flex justify-end">
            <div v-if="tx.transactionType === 'DEBIT'" class="flex items-center gap-0.5 bg-red-200 text-red-600 w-fit text-xs font-semibold rounded px-2 py-1">
              <span class="material-symbols-outlined"> call_made </span>
              {{ tx.transactionType }}
            </div>
            <div v-else class="flex items-center gap-0.5 bg-green-200 text-green-600 w-fit text-xs font-semibold rounded px-2 py-1">
              <span class="material-symbols-outlined"> call_received </span>
              {{ tx.transactionType }}
            </div>
          </td>
          <td class="p-2 py-3 text-right">{{ formatCurrency(tx.balanceAfterTransaction) }}</td>
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
