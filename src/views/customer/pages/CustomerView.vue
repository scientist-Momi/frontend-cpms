<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useCustomer } from '@/composables/useCustomer'
import PageLoader from '@/components/PageLoader.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import { useFunction } from '@/composables/useFunction'
import BaseChart from '@/components/charts/BaseChart.vue'
import PurchasesTable from '../components/PurchasesTable.vue'
import WalletTransactionsTable from '../components/WalletTransactionsTable.vue'
import { useModalStore } from '@/stores/modalStore'

const { formatDate, formatCurrency } = useFunction()
const { fetchCustomerId, fetchAllTransactions } = useCustomer()
const modal = useModalStore()
const route = useRoute()
const customerId = computed(() => route.params.id)

const customer = ref(null)
const allTransactions = ref(null)

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const res = await fetchCustomerId(customerId.value)
  const res2 = await fetchAllTransactions(customerId.value)
  // await retrievePermissions()
  customer.value = res.data
  allTransactions.value = res2.data
})

function getCustomerInitials(name) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const initials = parts.map((part) => part[0].toUpperCase()).join('')
  return initials
}

const activeTab = ref('product')

const chartSeries = computed(() => {
  if (!allTransactions.value) return [{ data: [] }]
  return [
    {
      data: allTransactions.value.map(tx => [
        new Date(tx.createdAt).getTime(),
        tx.totalAmount
      ])
    }
  ]
})

const walletTotals = computed(() => {
  let totalDeposits = 0
  let totalPurchases = 0

  if (
    customer.value &&
    customer.value.customerWallet &&
    Array.isArray(customer.value.customerWallet.transactions)
  ) {
    customer.value.customerWallet.transactions.forEach(tx => {
      if (tx.transactionType === 'DEPOSIT') {
        totalDeposits += Number(tx.amount)
      }
      if (tx.transactionType === 'PURCHASE') {
        totalPurchases += Math.abs(Number(tx.amount))
      }
    })
  }

  return {
    totalDeposits,
    totalPurchases
  }
})
</script>

<template>
  <div v-if="customer">
    <div class="flex gap-4">
      <div class="w-[70%]">
        <div class="border border-gray-200 bg-white p-4 flex gap-4 mb-4">
          <div class="w-[10%] flex items-center justify-center">
            <div class="rounded-full bg-red-500 p-4 text-xl font-semibold">
              {{ getCustomerInitials(customer.name) }}
            </div>
          </div>
          <div class="w-[80%]">
            <!-- <h1>{{ customer }}</h1> -->
            <div class="flex items-center justify-between mb-2 gap-4">
              <div class="border-b border-gray-200 w-full px-2 pb-2">
                <small>Name</small>
                <h1 class="text-base">{{ customer.name }}</h1>
              </div>
              <div class="border-b border-gray-200 w-full px-2 pb-2">
                <small>Email</small>
                <h1 class="text-base">{{ customer.email }}</h1>
              </div>
              <div class="border-b border-gray-200 w-full px-2 pb-2">
                <small>Phone</small>
                <h1 class="text-base">{{ customer.phone }}</h1>
              </div>
            </div>
            <div class="flex items-center justify-between mb-2 gap-4">
              <div class="border-b border-gray-200 w-full px-2 pb-2">
                <small>Type</small>
                <h1 class="text-base">{{ customer.customerType }}</h1>
              </div>
              <div class="border-b border-gray-200 w-full px-2 pb-2">
                <small>Status</small>
                <h1 class="text-base">{{ customer.status }}</h1>
              </div>
              <div class="border-b border-gray-200 w-full px-2 pb-2">
                <small>Date created</small>
                <h1 class="text-base">{{ formatDate(customer.createdAt) }}</h1>
              </div>
            </div>
            <div class="flex items-center justify-between mb-2 gap-4">
              <div class="border-b border-gray-200 w-full px-2 pb-2">
                <small>Notes</small>
                <h1 class="text-base">{{ customer.customerNotes }}</h1>
              </div>
              <div class="border-b border-gray-200 w-full px-2 pb-2">
                <small>Address</small>
                <h1 class="text-base">{{ customer.address }}</h1>
              </div>
            </div>
          </div>
          <div class="w-[10%] flex items-center justify-center">
            <SecondaryButton class="flex items-center gap-2"
              ><span class="material-symbols-outlined"> edit_square </span>Edit</SecondaryButton
            >
          </div>
        </div>
        <div class="border-gray-200 border rounded p-2">
          <BaseChart :series="chartSeries" title="Purchases" />
        </div>
      </div>
      <div class="w-[30%]">
        <div class="border border-gray-200 bg-white p-4 mb-4">
          <div class="mb-4">
            <small class="mb-2">Wallet Balance</small>
            <p class="text-3xl">
              {{
                customer.customerWallet ? formatCurrency(customer.customerWallet.balance) : 'N/A'
              }}
            </p>
          </div>
          <div class="">
            <SecondaryButton @click="modal.open('new_deposit', customer.customerWallet.balance, customer)" class="flex items-center gap-2"
              ><span class="material-symbols-outlined"> mintmark </span>New Deposit</SecondaryButton
            >
          </div>
        </div>
        <div class="border border-gray-200 bg-white p-4 mb-4">
          <div class="mb-4">
            <small class="mb-2">Credit Limit</small>
            <p class="text-3xl">
              {{ customer ? formatCurrency(customer.creditLimit) : 'N/A' }}
            </p>
          </div>
          <div class="">
            <SecondaryButton class="flex items-center gap-2"
              ><span class="material-symbols-outlined"> edit_square </span>Update
              Limit</SecondaryButton
            >
          </div>
        </div>
        <div class="border border-gray-200 bg-white p-4 mb-4">
          <div class="">
            <small class="mb-4">Total Overtime Deposit</small>
            <p class="text-3xl">
              {{ formatCurrency(walletTotals.totalDeposits) }}
            </p>
          </div>
        </div>
        <div class="border border-gray-200 bg-white p-4">
          <div class="">
            <small class="mb-4">Total Overtime Purchases</small>
            <p class="text-3xl">
              {{ formatCurrency(walletTotals.totalPurchases) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <div class="w-full">
        <!-- Tab buttons -->
        <div class="flex gap-2 mb-2">
          <button
            :class="[
              'p-1 px-2 cursor-pointer rounded text-sm border',
              activeTab === 'product'
                ? 'border-gray-200 text-red-600 bg-blue-50'
                : 'border-transparent text-gray-600 bg-white hover:bg-gray-50',
            ]"
            @click="activeTab = 'product'"
          >
            Product
          </button>
          <button
            :class="[
              'p-1 px-2 cursor-pointer text-sm rounded border',
              activeTab === 'wallet'
                ? 'border-gray-200 text-red-600 bg-blue-50'
                : 'border-transparent text-gray-600 bg-white hover:bg-gray-50',
            ]"
            @click="activeTab = 'wallet'"
          >
            Wallet
          </button>
        </div>

        <!-- Tab content -->
        <div class="border border-gray-200 rounded bg-white p-6">
          <div v-if="activeTab === 'product'">
            <PurchasesTable :purchase-transactions="allTransactions" />
          </div>
          <div v-else>
            <WalletTransactionsTable :wallet-transactions="customer.customerWallet.transactions"/>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="" v-else>
    <PageLoader />
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-size: 18px;
}
</style>
