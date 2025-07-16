<script setup>
import ProgressCircle from '@/components/ProgressCircle.vue'
import { useFunction } from '@/composables/useFunction'

defineProps({
  product: { type: Object, required: true },
})

const { formatCurrency } = useFunction()
</script>

<template>
  <div
    class="rounded overflow-hidden bg-white shadow-md border border-gray-100 flex flex-col items-center p-2"
  >
    <div class="w-full mb-2">
      <div class="w-fit p-2 text-xs text-red-500 rounded font-semibold bg-red-200">
        {{ product.brand }}
      </div>
    </div>

    <ProgressCircle
      :available="product.quantitySold"
      :total="product.inventory"
      :size="100"
      :color="'#05C3DD'"
    />

    <div class="flex flex-col my-3 items-center w-full">
      <span class="text-xs text-gray-400 block">Latest Price</span>
      <div class="text-lg font-bold text-gray-900 border px-2 py-1">
        {{ formatCurrency(product.latestPrice.price) }}
      </div>
    </div>
    <div class="w-full flex items-center gap-2 bg-gray-100 p-1">
      <div class="w-[85%]">
        <h1 class="font-semibold text-sm">{{ product.name }}</h1>
        <small class="text-xs">{{ product.description }}</small>
      </div>
      <div class="w-[15%] border flex justify-center hover:bg-gray-200 cursor-pointer">
        <span class="material-symbols-outlined"> arrow_right_alt </span>
      </div>
    </div>
  </div>
</template>
