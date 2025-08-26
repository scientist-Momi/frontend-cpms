<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTransaction } from '@/composables/useTransaction'
// import { useFunction } from '@/composables/useFunction'
import { useRoute } from 'vue-router'
import PageLoader from '../PageLoader.vue'

const { fetchTransactionReturns } = useTransaction()
// const { formatCurrency } = useFunction()
const loading = ref(false)
const returns = ref(null)
const route = useRoute()
const transactionId = computed(() => route.params.id)

onMounted(async () => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const res = await fetchTransactionReturns(transactionId.value)
  returns.value = res.data
  loading.value = false
})
</script>

<template>
  <div class="bg-white h-full">
    <div v-if="loading">
      <PageLoader />
    </div>
    <div v-else class="p-6 text-xs">
      {{ returns }}
    </div>

  </div>
</template>

<style scoped></style>
