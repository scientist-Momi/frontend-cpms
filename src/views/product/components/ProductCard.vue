<script setup>
import ProgressCircle from '@/components/ProgressCircle.vue'
import { useFunction } from '@/composables/useFunction'
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps({
  product: { type: Object, required: true },
})

const { formatCurrency } = useFunction()
</script>

<template>
  <div class="relative rounded-xl overflow-hidden bg-white shadow hover:shadow-lg border border-gray-200 flex flex-col items-center transition transform hover:scale-[1.01]">

    <div class="absolute top-3 left-3 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded ">
      {{ product.brand }}
    </div>

    <div class="pt-8 pb-4 mt-2">
      <ProgressCircle
        :available="product.quantitySold"
        :total="product.inventory"
        :size="100"
        :color="'#05C3DD'"
      />
    </div>

    <div class="flex flex-col items-center mb-4 w-full">
      <span class="text-xs text-gray-400">Latest Price</span>
      <div class="text-lg font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded px-3 py-1 mt-1 shadow-sm">
        {{ formatCurrency(product.latestPrice.price) }}
      </div>
    </div>

    <div class="w-full flex items-center justify-between bg-gray-50 border-t border-gray-200 px-4 py-3">
      <div class="flex flex-col pr-1">
        <h2 class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</h2>
        <p class="text-xs text-gray-500 truncate">{{ product.description }}</p>
      </div>
      <div
      @click="router.push({ name: 'ProductView', params: {id: product.id} })"
        class="p-1 border rounded hover:bg-gray-100 cursor-pointer transition"
        title="View product"
      >
        <span class="material-symbols-outlined text-gray-600">arrow_right_alt</span>
      </div>
    </div>

  </div>
</template>

