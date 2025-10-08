<script setup>
import { useFunction } from '@/composables/useFunction'
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps({
  product: { type: Object, required: true },
})

const { formatCurrency } = useFunction()
</script>

<template>
  <div
  @click="router.push({ name: 'ProductView', params: { id: product.id } })"
    class="border border-gray-200 p-4 bg-white shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
  >
    <div class="flex justify-between items-center mb-2">
      <p
        class="text-blue-600 font-semibold"
      >
        {{ product.name }}
      </p>
      <span
        class="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded font-medium border border-blue-100"
      >
        {{ product.brand }}
      </span>
    </div>
    <div class="mb-3">
      <p class="text-gray-500 text-sm">{{ product.description }}</p>
    </div>
    <div class="flex gap-4 items-center text-sm">
      <div class="flex items-center gap-1">
        <span class="material-symbols-outlined text-red-700"> attach_money </span>
        <span class="font-semibold">{{ formatCurrency(product.latestPrice.price) }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="material-symbols-outlined text-blue-500"> inventory_2 </span>
        <span class="font-semibold">{{ product.quantitySold }}</span>
        <span class="text-gray-400">/ {{ product.inventory }}</span>
      </div>
    </div>

  </div>
</template>
