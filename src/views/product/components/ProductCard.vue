<!-- <script setup>
import ProgressBar from '@/components/ProgressBar.vue'

const props = defineProps({
  product: { type: Object, required: true },
})

// For demo: let's assume max inventory is 300 for all products.
// If you have a different logic for "total", adjust accordingly.
const total = 300
</script>

<template>
  <div class="bg-white rounded border border-gray-200 p-6 flex flex-col items-start">
    <div class="font-semibold text-lg mb-1">{{ product.name }}</div>
    <div class="text-sm text-gray-500 mb-2">{{ product.brand }}</div>
    <div class="text-gray-700 mb-4">{{ product.description }}</div>
    <ProgressBar :available="product.inventory" :total="total" class="w-full" />
    <div class="mt-2 text-blue-600 font-bold">
      ₦{{ product.latestPrice.price.toLocaleString() }}
    </div>
  </div>
</template> -->

<script setup>
import ProgressBar from '@/components/ProgressBar.vue'

 defineProps({
  product: { type: Object, required: true },
})

// Example: set your own logic for total if needed
const total = 300
</script>

<template>
  <div class=" rounded-sm overflow-hidden bg-[#F9F8F4] shadow-md border border-gray-100 flex flex-col">
    <!-- Card Header with accent background -->
    <div
      class="h-20 w-full rounded-t-sm relative flex items-end"
      style="background: linear-gradient(90deg, #e74c3c 60%, #f39c12 100%);"
    >
      <div class="absolute top-0 left-0 w-full h-full opacity-60"
           style="background: url('/your-blur-image.jpg') center/cover, linear-gradient(90deg, #e74c3c 60%, #f39c12 100%);"></div>
      <div class="relative z-10 p-3 text-white text-right w-full text-xs font-semibold tracking-wide">
        {{ product.brand }}
      </div>
    </div>

    <div class="flex-1 p-4 flex flex-col">
      <div class="font-bold text-base mb-1 text-gray-800 truncate">{{ product.name }}</div>
      <div class="text-xs text-gray-500 mb-3">{{ product.description }}</div>
      <div class="flex justify-between mt-4">
        <div class="w-full">
          <span class="text-xs text-gray-400 block">Inventory</span>
          <ProgressBar :available="product.inventory" :total="total" class="w-full mb-3" />
        </div>
        <div class="text-right w-full">
          <span class="text-xs text-gray-400 block">Latest Price</span>
          <div class="text-lg font-bold text-gray-900">{{ product.latestPrice.price}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

