<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useFunction } from '@/composables/useFunction'  // Assuming you have format utils here
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'

const products = useProductStore()
const { formatCurrency, formatWithCommas } = useFunction()

const productRankingType = ref('quantity') // 'quantity' or 'price'

function toggleProductRanking() {
  productRankingType.value = productRankingType.value === 'quantity' ? 'price' : 'quantity'
}

const rankedByQuantity = computed(() => {
  return [...products.products]   // Assuming your store exposes `products` array
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5)
})

const rankedByPrice = computed(() => {
  return [...products.products]
    .sort((a, b) => b.latestPrice.price - a.latestPrice.price)
    .slice(0, 5)
})

const displayedProductRanking = computed(() => {
  return productRankingType.value === 'quantity' ? rankedByQuantity.value : rankedByPrice.value
})
</script>

<template>
<div class="border border-gray-200 rounded w-full">
        <div class="flex items-center p-4 border-b border-gray-200 gap-2 justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined"> leaderboard </span>
            <p class="font-semibold">Product Ranking</p>
    </div>
    <SecondaryButton
      @click="toggleProductRanking"
    >
      Rank by {{ productRankingType === 'quantity' ? 'Price' : 'Quantity Sold' }}
    </SecondaryButton>
  </div>

  <div class="overflow-x-auto ">
    <table class="w-full text-left table-auto border-collapse">
      <thead class="bg-blue-50 sticky top-0 z-10">
        <tr>
          <th class="w-12 px-4 py-3 font-semibold text-sm text-gray-700">#</th>
          <th class="px-4 py-3 font-semibold text-sm text-gray-700">Product Name</th>
          <th class="px-4 py-3 font-semibold text-sm text-gray-700">Quantity Sold</th>
          <th class="px-4 py-3 font-semibold text-sm text-gray-700">Latest Price</th>
        </tr>
      </thead>
      <tbody class="text-gray-700 text-sm">
        <tr
          v-for="(product, index) in displayedProductRanking"
          :key="product.id"
          :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
          class="hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <td
            class="px-4 py-3 font-bold text-center"
            :class="{
              'bg-yellow-300': index === 0,
              'bg-gray-300': index === 1,
              'bg-amber-400': index === 2,
              'bg-blue-200': index === 3,
              'bg-green-200': index === 4,
            }"
          >
            {{ index + 1 }}
          </td>
          <td class="px-4 py-3 font-medium">{{ product.name }}</td>
          <td class="px-4 py-3">{{ formatWithCommas(product.quantitySold) }}</td>
          <td class="px-4 py-3">{{ formatCurrency(product.latestPrice.price) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>
