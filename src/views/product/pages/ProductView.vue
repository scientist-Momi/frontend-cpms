<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import PageLoader from '@/components/PageLoader.vue'
import ProgressCircle from '@/components/ProgressCircle.vue'
import { useFunction } from '@/composables/useFunction'
import { useProduct } from '@/composables/useProduct'
import BaseChart from '@/components/charts/BaseChart.vue'
import ProductTransactionsTable from '../components/ProductTransactionsTable.vue'

const route = useRoute()
const { fetchProductId, fetchProductTransactions } = useProduct()
const productId = computed(() => route.params.id)

const product = ref(null)
const transactions = ref([])
const activeTab = ref('transactions')

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const res = await fetchProductId(productId.value)
  const res2 = await fetchProductTransactions(productId.value)
  product.value = res.data
  transactions.value = res2.data
})

// Assume "product" is a reactive prop or value with the full product object
const series = computed(() => {
  // Fallback for no prices
  if (!product.value.prices || !product.value.prices.length) {
    return [
      {
        name: 'Price',
        data: [],
      },
    ]
  }
  // Sort price history by createdAt
  const sortedPrices = product.value.prices
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  // Format as [timestamp, price]
  const data = sortedPrices.map((entry) => [new Date(entry.createdAt).getTime(), entry.price])

  return [
    {
      name: 'Price',
      data,
    },
  ]
})
</script>

<template>
  <div v-if="product">
    <div class="border rounded border-gray-200 p-2 mb-4">
      <div class="flex items-center justify-between mb-2 gap-4">
        <div class="w-full px-2">
          <small>Name</small>
          <h1 class="text-base">{{ product.name }}</h1>
        </div>
        <div class="w-full px-2">
          <small>Brand</small>
          <h1 class="text-base">{{ product.brand }}</h1>
        </div>
        <div class="w-full px-2">
          <small>Description</small>
          <h1 class="text-base">{{ product.description }}</h1>
        </div>
      </div>
    </div>
    <div class="flex gap-4 mb-4">
      <div class="w-[35%] border rounded p-2 h-fit">
        <div
          class="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          <svg
            class="shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
            />
          </svg>
          <span class="sr-only">Info</span>
          <div>
            Out of a total of <span class="font-bold">{{ product.inventory }}</span> product,
            <span class="font-bold">{{ product.quantitySold }}</span> have been sold.
          </div>
        </div>
        <div class="flex items-center justify-center">
          <ProgressCircle
            :available="product.quantitySold"
            :total="product.inventory"
            :size="200"
            :color="'#05C3DD'"
          />
        </div>
      </div>

      <div class="w-[65%] p-2 border border-gray-200 rounded">
        <BaseChart :series="series" title="Current Price" />
      </div>
    </div>
    <div class="w-full">
      <!-- Tab buttons -->
      <div class="flex gap-2 mb-2">
        <button
          :class="[
            'p-1 px-2 cursor-pointer rounded text-sm border',
            activeTab === 'transactions'
              ? 'border-gray-200 text-red-600 bg-blue-50'
              : 'border-transparent text-gray-600 bg-white hover:bg-gray-50',
          ]"
          @click="activeTab = 'transactions'"
        >
          Transactions
        </button>
        <button
          :class="[
            'p-1 px-2 cursor-pointer text-sm rounded border',
            activeTab === 'variants'
              ? 'border-gray-200 text-red-600 bg-blue-50'
              : 'border-transparent text-gray-600 bg-white hover:bg-gray-50',
          ]"
          @click="activeTab = 'variants'"
        >
          Variants
        </button>
      </div>

      <!-- Tab content -->
      <div class="border border-gray-200 rounded bg-white p-2">
        <div v-if="activeTab === 'transactions'">
          <div
            class="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <svg
              class="shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
              />
            </svg>
            <span class="sr-only">Info</span>
            <div>All transactions that involve the purchase of this product.</div>
          </div>
          {{ transactions }}
        </div>
        <div v-else></div>
      </div>
    </div>
    <h1>{{ product }}</h1>
  </div>
  <div v-else>
    <PageLoader />
  </div>
</template>

<style scoped></style>
