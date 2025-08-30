<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTransaction } from '@/composables/useTransaction'
import { useRoute } from 'vue-router'
import PageLoader from '../PageLoader.vue'
import { useFunction } from '@/composables/useFunction'
// Uncomment and use a formatter if desired

const { fetchTransactionReturns } = useTransaction()
const { formatCurrency, formatDateLongWithTimeBy } = useFunction()
const loading = ref(false)
const returns = ref(null)
const route = useRoute()
const transactionId = computed(() => route.params.id)

onMounted(async () => {
  const res = await fetchTransactionReturns(transactionId.value)
  returns.value = res.data
  loading.value = false
})

</script>

<template>
  <div class="bg-white min-h-screen">
    <div v-if="loading">
      <PageLoader />
    </div>

    <div v-else class="">

      <div class="">
        <div class="text-3xl font-semibold text-red-500 mb-4 flex items-baseline">
          <p></p>
        </div>

        <div v-for="item in returns" :key="item.returnId">
          <div class="flex flex-col">
            <div class="flex items-center">
              <span class="w-2 h-2 rounded-full bg-gray-400 mr-4"></span>
              <small>{{ formatDateLongWithTimeBy(item.updatedAt) }}</small>
            </div>
            <div class="flex flex-col flex-1 border-l-2 border-gray-400 ml-1 pl-4.5">
              <p class="text-2xl my-2 text-red-500">{{ formatCurrency(item.totalAmount) }}</p>
              <div v-for="detail in item.returnDetails" :key="detail.detailId" class="pb-4">
                <p class="text-gray-900 text-sm">
                  {{ detail.product.name }} &bull; {{ detail.variant.weight }}kg ×
                  {{ detail.quantity }} unit(s)
                </p>
                <p class="text-red-500 text-sm">
                  {{ formatCurrency(detail.variant.weight * detail.quantity * detail.unitPrice) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
