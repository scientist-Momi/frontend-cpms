<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useTransaction } from '@/composables/useTransaction'
import { useFunction } from '@/composables/useFunction'
import PageLoader from '@/components/PageLoader.vue'
import TransactionDetailsTable from '../components/TransactionDetailsTable.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useModalStore } from '@/stores/modalStore'

const { formatCurrency, getCustomerInitials, formatDateLongWithTimeBy } = useFunction()
const { fetchTransaction } = useTransaction()
const route = useRoute()
const modal = useModalStore()
const transactionId = computed(() => route.params.id)

const transaction = ref(null)

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const res = await fetchTransaction(transactionId.value)
  transaction.value = res.data
})
</script>

<template>
  <div v-if="transaction">
    <div class="border border-gray-200 bg-white p-4 flex gap-8 mb-4">
      <div
        class="rounded bg-red-500 flex items-center justify-center p-6 text-3xl font-semibold min-w-[7rem] text-white"
      >
        {{ getCustomerInitials(transaction.customerName) }}
      </div>

      <div class="flex-1">
        <router-link :to="{ name: 'CustomerView', params: { id: transaction.customerId } }">
          <h1 class="text-xl font-semibold mb-2 hover:underline">{{ transaction.customerName }}</h1>
        </router-link>
        <p class="mb-4">
          Purchase was made on {{ formatDateLongWithTimeBy(transaction.createdAt) }}
        </p>
        <div class="flex gap-10">
          <div>
            <small class="text-xs">Total Amount</small>
            <p class="font-medium text-xl">{{ formatCurrency(transaction.totalAmount) }}</p>
          </div>
          <div>
            <small class="text-xs">Total Quantity</small>
            <p class="font-medium text-xl">{{ transaction.totalQuantity }}</p>
          </div>
          <div>
            <small class="text-xs">Total Discount</small>
            <p class="font-medium text-xl">{{ formatCurrency(transaction.totalDiscount) }}</p>
          </div>
        </div>
      </div>
      <div class="flex items-start gap-2 ml-auto">
        <SecondaryButton @click="modal.open('return_transaction', transactionId)"
          >Initiate Return</SecondaryButton
        >
        <PrimaryButton>Edit Transaction</PrimaryButton>
      </div>
    </div>
    <div class="border border-gray-200 bg-white p-4">
      <TransactionDetailsTable :purchase-transactions="transaction.transactionDetails" />
    </div>
  </div>
  <div class="" v-else>
    <PageLoader />
  </div>
</template>
