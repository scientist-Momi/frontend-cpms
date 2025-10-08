<script setup>
import { computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import SecondaryStatsCard from '@/components/SecondaryStatsCard.vue'
// import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import ProductsChart from '@/components/charts/ProductChart.vue'
import ProductQuantityChart from '@/components/charts/ProductQuantityChart.vue'
import ProductCard from '../components/ProductCard.vue'
import { useFunction } from '@/composables/useFunction'
import { useRouter } from 'vue-router'
const router = useRouter()

const product = useProductStore()
const { formatWithCommas } = useFunction()

const totalSold = computed(() => {
  return product.products.reduce((sum, product) => {
    return sum + (product.quantitySold || 0)
  }, 0)
})

const totalUnsold = computed(() => {
  return product.products.reduce((sum, product) => {
    const unsold = (product.inventory || 0) - (product.quantitySold || 0)
    return sum + unsold
  }, 0)
})
</script>

<template>
  <div>
    <div v-if="$route.name === 'Products'">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">Product Overview</h1>
        <div class="flex items-center gap-2">
          <!-- <SecondaryButton class="flex items-center gap-2">
            <span class="material-symbols-outlined"> file_save </span>
            <p>Export</p>
          </SecondaryButton> -->
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
          :value="formatWithCommas(totalSold)"
          icon="attach_money"
        />
        <SecondaryStatsCard
          label="Total Products Unsold"
          :value="formatWithCommas(totalUnsold)"
          icon="money_off"
        />
      </div>
      <div class="flex gap-4 mb-4">
        <ProductsChart
          class="w-full border border-gray-200 p-2 rounded"
          :products="product.products"
        />
        <ProductQuantityChart
          class="w-full border border-gray-200 p-2 rounded"
          :products="product.products"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 border border-gray-200">
        <ProductCard v-for="product in product.products" :key="product.id" :product="product" />
        <div
          v-if="!product.products.length"
          class="col-span-full flex flex-col items-center justify-center py-16 text-gray-400"
        >
          <span class="material-symbols-outlined text-6xl mb-2">inventory_2</span>
          <div class="text-lg font-medium mb-2">No products found.</div>
          <PrimaryButton
            @click="router.push({ name: 'NewProduct' })"
            class="flex items-center gap-2"
          >
            <span class="material-symbols-outlined"> box_add </span>
            <p>New Product</p>
          </PrimaryButton>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<style scoped></style>
