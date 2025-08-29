<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTransaction } from '@/composables/useTransaction'
import { useRoute } from 'vue-router'
import PageLoader from '../PageLoader.vue'
import { useFunction } from '@/composables/useFunction'
// Uncomment and use a formatter if desired

const { fetchTransactionReturns } = useTransaction()
const { formatCurrency, formatDate, formatDateLongWithTimeBy } = useFunction()
const loading = ref(false)
const returns = ref(null)
const route = useRoute()
const transactionId = computed(() => route.params.id)

onMounted(async () => {
  // loading.value = true
  // await new Promise((resolve) => setTimeout(resolve, 2500))
  const res = await fetchTransactionReturns(transactionId.value)
  returns.value = res.data
  loading.value = false
})

// Helper for formatting (replace currency as needed)
// function formatCurrency(n) {
//   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n / 100)
// }
// function formatDate(dateStr) {
//   return new Date(dateStr).toLocaleString()
// }
</script>

<template>
  <div class="bg-white min-h-screen">
    <div v-if="loading">
      <PageLoader />
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="item in returns"
        :key="item.returnId"
        class="bg-white shadow-md p-5 border border-gray-200"
      >
        <!-- Header -->
        <div class="flex justify-between items-center border-b pb-3 mb-3">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Return #{{ item.returnId }}</h2>
            <p class="text-sm text-gray-500">Transaction ID: {{ item.transactionId }}</p>
          </div>
          <div class="text-right">
            <p class="text-xl font-bold text-red-600">–{{ formatCurrency(item.totalAmount) }}</p>
            <p class="text-xs text-gray-500">Qty: {{ item.totalQuantity }}</p>
          </div>
        </div>

        <!-- Return Details -->
        <div class="space-y-2">
          <div
            v-for="detail in item.returnDetails"
            :key="detail.detailId"
            class="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
          >
            <div>
              <p class="font-medium text-gray-700">{{ detail.product.name }}</p>
              <p class="text-xs text-gray-500">Brand: {{ detail.product.brand }}</p>
              <p class="text-xs text-gray-400">Weight: {{ detail.variant.weight }}kg</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-800">
                {{ formatCurrency(detail.unitPrice) }} × {{ detail.quantity }}
              </p>
              <p class="text-xs text-gray-500">
                Subtotal: {{ formatCurrency(detail.unitPrice * detail.quantity) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-4 border-t pt-3 text-xs text-gray-400">
          Last updated: {{ formatDate(item.updatedAt) }}
        </div>
      </div>

      <div class="">
        <div class="text-3xl font-semibold text-red-500 mb-4 flex items-baseline">
          <span class="mr-1">−</span>
          <span>$40</span>
          <span class="text-gray-500">,</span>
          <span>000</span>
          <span class="align-super text-base text-gray-500">.00</span>
        </div>

        <div
        v-for="item in returns"
        :key="item.returnId"
         class="">
          <div class="flex flex-col">
            <div class="flex items-center">
              <span class="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
              <p>From Mercury Savings ••7658</p>
            </div>
            <div class="flex">
              <span class="w-0.5 h-10 bg-gray-400 ml-0.5 mr-3"></span>
              <small>{{ formatDateLongWithTimeBy(item.updatedAt) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
