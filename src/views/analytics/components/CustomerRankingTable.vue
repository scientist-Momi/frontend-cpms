<script setup>
import { computed, ref } from 'vue'
import { useFunction } from '@/composables/useFunction'
import { useTransactionStore } from '@/stores/TransactionStore'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'

const transactions = useTransactionStore()

const { formatCurrency, formatWithCommas } = useFunction()

function getTopPurchasers(transactions, topN = 10) {
  // Aggregate totals by customerId
  const customerTotals = {}

  transactions.forEach((tx) => {
    const id = tx.customerId
    if (!customerTotals[id]) {
      customerTotals[id] = {
        customerName: tx.customerName,
        totalAmount: 0,
        totalQuantity: 0,
      }
    }
    customerTotals[id].totalAmount += tx.totalAmount
    customerTotals[id].totalQuantity += tx.totalQuantity
  })

  // Convert to array for sorting
  const rankingArray = Object.entries(customerTotals).map(([customerId, data]) => ({
    customerId,
    customerName: data.customerName,
    totalAmount: data.totalAmount,
    totalQuantity: data.totalQuantity,
  }))

  // Top purchasers by amount
  const topByAmount = [...rankingArray].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, topN)

  // Top purchasers by quantity
  const topByQuantity = [...rankingArray]
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, topN)

  return { topByAmount, topByQuantity }
}

const rankings = computed(() => getTopPurchasers(transactions.transactions, 5))

// Destructure computed to expose to template
const topByAmount = computed(() => rankings.value.topByAmount)
const topByQuantity = computed(() => rankings.value.topByQuantity)

const rankingType = ref('amount')

function toggleRanking() {
  rankingType.value = rankingType.value === 'amount' ? 'quantity' : 'amount'
}

const displayedRanking = computed(() => {
  return rankingType.value === 'amount' ? topByAmount.value : topByQuantity.value
})
</script>

<template>
  <div class="border border-gray-200 rounded w-full">
    <div class="flex items-center p-4 border-b border-gray-200 gap-2 justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined"> hotel_class </span>
        <p class="font-semibold">Customers Ranking</p>
      </div>
      <SecondaryButton @click="toggleRanking">
        Rank by {{ rankingType === 'amount' ? 'Quantity' : 'Amount' }}
      </SecondaryButton>
    </div>
    <div class="">
      <div class="overflow-x-auto">
        <table class="w-full text-left table-auto border-collapse">
          <thead class="bg-blue-50 sticky top-0 z-10">
            <tr>
              <th class="px-4 py-3 font-semibold text-sm text-gray-700 w-12">#</th>
              <th class="px-4 py-3 font-semibold text-sm text-gray-700">Name</th>
              <th class="px-4 py-3 font-semibold text-sm text-gray-700">Amount Total</th>
              <th class="px-4 py-3 font-semibold text-sm text-gray-700">Quantity Total</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-sm">
            <tr
              v-for="(tx, index) in displayedRanking"
              :key="tx.customerId"
              :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
              class="hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <td
                class="px-4 py-3 font-bold text-center"
                :class="{
                  'bg-yellow-500': index === 0,
                  'bg-yellow-400': index === 1,
                  'bg-yellow-700': index === 2,
                  'bg-blue-600': index === 3,
                  'bg-green-600': index === 4,
                }"
              >
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3 font-medium">{{ tx.customerName }}</td>
              <td class="px-4 py-3">{{ formatCurrency(tx.totalAmount) }}</td>
              <td class="px-4 py-3">{{ formatWithCommas(tx.totalQuantity) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
