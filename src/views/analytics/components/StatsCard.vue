<script setup>
import { computed } from 'vue'
import { useCustomerStore } from '@/stores/customerStore'
import { useProductStore } from '@/stores/productStore'
import { useFunction } from '@/composables/useFunction'

const customers = useCustomerStore()
const products = useProductStore()

const { formatCurrency, formatWithCommas } = useFunction()

const totalInventory = computed(() => {
  return products.products.reduce((sum, product) => {
    return sum + (product.inventory || 0)
  }, 0)
})

const totalSold = computed(() => {
  return products.products.reduce((sum, product) => {
    return sum + (product.quantitySold || 0)
  }, 0)
})

const totalRevenue = computed(() => {
  return customers.financialSummary?.totalRevenue || 0
})

const cards = computed(() => [
  {
    icon: 'groups',
    iconBg: 'bg-white',
    iconColor: 'text-blue-600',
    label: 'Active customers',
    value: formatWithCommas(customers.customers.length),
    delta: '+22,325',
    percent: '12.2%',
    deltaColor: 'text-green-600',
    period: 'last 12 months',
  },
  {
    icon: 'inventory',
    iconBg: 'bg-white',
    iconColor: 'text-orange-500',
    label: 'Product Inventory',
    value:
      formatWithCommas(products.products.length) +
      ' (' +
      formatWithCommas(totalInventory.value) +
      ')',
    delta: '+22,325',
    percent: '12.2%',
    deltaColor: 'text-green-600',
    period: 'last 12 months',
  },
  {
    icon: 'sell',
    iconBg: 'bg-white',
    iconColor: 'text-red-600',
    label: 'Products Sold',
    value: formatWithCommas(totalSold.value),
    delta: '+22,325',
    percent: '12.2%',
    deltaColor: 'text-green-600',
    period: 'last 12 months',
  },
  {
    icon: 'finance_mode',
    iconBg: 'bg-white',
    iconColor: 'text-green-500',
    label: 'Total Revenue',
    value: formatCurrency(totalRevenue.value),
    delta: '+22,325',
    percent: '12.2%',
    deltaColor: 'text-green-600',
    period: 'last 12 months',
  },
])
</script>

<template>
  <div class="flex gap-4">
    <div
      v-for="(card, idx) in cards"
      :key="idx"
      class="bg-white rounded shadow border border-gray-100 p-4 flex-1 min-w-[260px] flex flex-col gap-4"
    >
      <div
        :class="[
          'w-10 h-10 flex items-center justify-center border border-gray-200 shadow rounded-xl mb-2',
          card.iconBg,
        ]"
      >
        <span :class="['material-symbols-outlined text-2xl', card.iconColor]">{{ card.icon }}</span>
      </div>
      <div>
        <div class="text-gray-600 text-sm font-medium mb-2">{{ card.label }}</div>
        <div class="text-3xl font-medium text-gray-900 mb-2">{{ card.value }}</div>
        <div class="flex items-center gap-2 text-sm">
          <!-- <span :class="card.deltaColor">{{ card.delta }} ({{ card.percent }})</span> -->
          <!-- <span class="text-gray-400">&bull;</span>
          <span class="text-gray-400">{{ card.period }}</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
