<script setup>
import { useProductStore } from '@/stores/productStore'
import SecondaryStatsCard from '@/components/SecondaryStatsCard.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import ProductsChart from '@/components/charts/ProductChart.vue'
import ProductCard from '../components/ProductCard.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const product = useProductStore()

const products = [
  { name: 'Western Europe 2025-02', valueSold: 750000, totalPrice: 2500 },
  { name: 'Eastern Europe 2025-03', valueSold: 320000, totalPrice: 1600 },
  { name: 'Eastern Europe 2025-04', valueSold: 510000, totalPrice: 1700 },
]
</script>

<template>
  <div>
    <div v-if="$route.name === 'Products'">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">Product Overview</h1>
        <div class="flex items-center gap-2">
          <SecondaryButton class="flex items-center gap-2">
            <span class="material-symbols-outlined"> file_save </span>
            <p>Export</p>
          </SecondaryButton>
          <PrimaryButton
            @click="router.push({ name: 'NewProduct' })"
            class="flex items-center gap-2"
          >
            <span class="material-symbols-outlined"> box_add </span>
            <p>New Product</p>
          </PrimaryButton>
        </div>
      </div>
      <div class="flex gap-6 mb-4">
        <SecondaryStatsCard label="Total Products" :value="product.products.length" icon="groups" />
        <SecondaryStatsCard
          label="Total Products Sold"
          :value="product.products.length"
          icon="attach_money"
        />
        <SecondaryStatsCard
          label="Total Products Unsold"
          :value="product.products.length"
          icon="money_off"
        />
      </div>
      <div class="flex gap-4 mb-4">
        <ProductsChart class="w-full border border-gray-200 p-2 rounded" :products="products" />
        <ProductsChart class="w-full border border-gray-200 p-2 rounded" :products="products" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 p-4 border border-gray-200">
        <ProductCard v-for="product in product.products" :key="product.id" :product="product" />
      </div>
    </div>
    <router-view />
  </div>
</template>

<style scoped></style>
