<script setup>
import { ref, onMounted } from 'vue'
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'
import PageLoader from '../PageLoader.vue'
import { useModalStore } from '@/stores/modalStore'
import { useToastStore } from '@/stores/toastStore'
import { useTransaction } from '@/composables/useTransaction'

const toast = useToastStore()
const { fetchTransaction } = useTransaction()
const loading = ref(false)
const modal = useModalStore()
const transaction = ref(null)

onMounted(async () => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const res = await fetchTransaction(modal.data)
  transaction.value = res.data
  loading.value = false
})
</script>

<template>
  <div class="bg-white h-full">
    <div v-if="loading">
      <PageLoader />
    </div>
    <div v-else class="p-6">
      <div v-if="transaction == null">
        <h1>No such transaction.</h1>
      </div>
      <div v-else>
        {{ transaction }}
        <table class="w-full text-left">
      <thead class="text-xs border-b border-gray-200">
        <tr>
          <th class="px-2 py-2 font-medium">Transaction</th>
          <th class="px-2 py-2 font-medium">Quantity to return</th>


        </tr>
      </thead>
      <tbody class="text-sm">
        <tr
          v-for="tx in purchaseTransactions"
          :key="tx.detailId"
          class="border-b border-gray-200 hover:bg-gray-50 transition"
        >
          <td class="p-2 py-3">{{  tx.product.name }}</td>
          <td class="p-2 py-3">{{  formatCurrency(tx.unitPrice) }}</td>

        </tr>
      </tbody>
    </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
