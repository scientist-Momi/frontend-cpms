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
  <div class="border border-gray-200 p-4 hover:bg-gray-50">
    <div class="flex justify-between items-center">
      <p
        @click="router.push({ name: 'ProductView', params: { id: product.id } })"
        class="text-red-500 hover:underline cursor-pointer"
      >
        {{ product.name }}
      </p>
      <p class="border border-gray-200 text-xs p-1 bg-white">{{ product.brand }}</p>
    </div>
    <div class="mt-2">
      <p class="text-sm">{{ product.description }}</p>
    </div>
    <div class="mt-4 flex gap-2 items-center text-sm">
      <div class="flex items-center">
        <span class="material-symbols-outlined text-orange-400"> attach_money </span>
        <p>{{ formatCurrency(product.latestPrice.price) }}</p>
      </div>
      <div class="flex items-center gap-0.5">
        <span class="material-symbols-outlined text-blue-500"> inventory_2 </span>
        <p>{{ product.quantitySold }}/{{ product.inventory }}</p>
      </div>
    </div>
  </div>
</template>
