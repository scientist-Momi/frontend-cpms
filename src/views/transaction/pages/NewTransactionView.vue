<script setup>
import { ref, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useCustomerStore } from '@/stores/customerStore'
import { useFunction } from '@/composables/useFunction'
import { useProduct } from '@/composables/useProduct'
import { useProductStore } from '@/stores/productStore'
import { useTransaction } from '@/composables/useTransaction'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useToastStore } from '@/stores/toastStore'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modalStore'
import { useCustomer } from '@/composables/useCustomer'


const router = useRouter()
const modal = useModalStore()
const toast = useToastStore()
const productStore = useProductStore()
const productOptions = computed(() => productStore.products)

const customers = useCustomerStore()
const customerId = ref('')
const allCustomers = computed(() => customers.customers || [])

const { formatCurrency, formatCurrencyTrans } = useFunction()
const { fetchVariants, fetchProducts } = useProduct()
const { createTransaction, fetchTransactions } = useTransaction()
const {fetchCustomers} = useCustomer()

const wrapperRef = ref()
const dropdownOpen = ref(false)
const search = ref('')
const selectedCustomer = ref(null)

const filteredCustomers = computed(() => {
  const s = search.value.toLowerCase()
  if (!s) return allCustomers.value
  return allCustomers.value.filter((cust) => cust.name.toLowerCase().includes(s))
})

function onInputFocus() {
  dropdownOpen.value = true
}

function pickCustomer(cust) {
  selectedCustomer.value = cust
  customerId.value = selectedCustomer.value.customerId
  search.value = cust.name
  dropdownOpen.value = false
}

onClickOutside(wrapperRef, () => (dropdownOpen.value = false))

watch(search, (val) => {
  if (!selectedCustomer.value) return
  if (val !== selectedCustomer.value.name) selectedCustomer.value = null
})

const fetchProductVariants = async (productId) => {
  try {
    const res = await fetchVariants(productId)
    return { success: true, data: res.data }
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Variants fetch failed',
    }
  }
}


const rows = ref([
  {
    productId: null,
    variantId: null,
    quantity: 1,
    unitPrice: null,
    unitPriceDisplay: null,
    variantWeight: null,
    lineDiscount: 0,
    variants: [],
  },
])

function addRow() {
  rows.value.push({
    productId: null,
    variantId: null,
    quantity: 1,
    unitPrice: null,
    unitPriceDisplay: null,
    variantWeight: null,
    lineDiscount: 0,
    variants: [],
  })
}

function removeRow(idx) {
  if (rows.value.length > 1) rows.value.splice(idx, 1)
}

async function onProductSelect(row) {
  if (!row.productId) {
    row.variants = []
    row.variantId = null
    row.unitPrice = null
    row.variantWeight = null
    return
  }

  const result = await fetchProductVariants(row.productId)
  row.variants = result.success ? result.data : []
  if (row.variants.length === 0) {
    toast.showToast({
      message: 'This product does not have any variants yet.',
      type: 'error',
    })
  }

  const product = productOptions.value.find((p) => p.id === row.productId)
  row.unitPriceDisplay = product?.latestPrice?.price ?? 0
  row.unitPrice = row.unitPriceDisplay
  row.variantId = null
  row.variantWeight = null
  row.quantity = 1
  row.lineDiscount = 0
}

function onVariantSelect(row) {
  const v = row.variants.find((v) => v.id === row.variantId)
  row.variantWeight = v ? v.weight : null
}

function rowTotal(row) {
  const w = +row.variantWeight || 0
  const p = +row.unitPrice || 0
  const q = +row.quantity || 0
  const d = +row.lineDiscount || 0
  return w * p * q - d
}

const grandTotal = computed(() => rows.value.reduce((sum, row) => sum + rowTotal(row), 0))

const onSubmit = async () => {
  if (!customerId.value) {
    toast.showToast({
      message: 'Please, choose a customer.',
      type: 'error',
    })
    return
  }
  for (const row of rows.value) {
    if (!row.productId || !row.variantId || !row.quantity || !row.unitPrice) {
      toast.showToast({
      message: 'Fill all fields in each row.',
      type: 'error',
    })
      return
    }
  }

  const payload = {
    customerId: customerId.value,
    transactionDetails: rows.value.map((row) => ({
      productId: row.productId,
      variantId: row.variantId,
      quantity: +row.quantity,
      unitPrice: +row.unitPrice,
      lineDiscount: +row.lineDiscount,
    })),
  }
  const res = await createTransaction(payload)
  modal.open("loadingState")
  await new Promise((resolve) => setTimeout(resolve, 2500))
  if(res.success){
    await fetchTransactions()
    await fetchCustomers()
    await fetchProducts()
    toast.showToast({
      message: 'Transaction has been saved!',
      type: 'success',
    })
    modal.close()
    router.push({name: 'Transactions'})
  }else{
    toast.showToast({
      message: res.message || 'Failed to save transaction.',
      type: 'error',
    })
    modal.close()
  }
}
</script>

<template>
  <div ref="wrapperRef" class="mb-4 bg-white rounded">
    <div class="flex items-center p-4 border-b border-gray-200 gap-2 mb-2">
      <span class="material-symbols-outlined"> contract_edit </span>
      <p class="font-semibold">New Transaction Form</p>
    </div>

    <div
      class="flex items-center p-4 mb-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
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
        To continue with initiating a new transaction. You must pick the customer the transaction is
        meant for my searching for their name and clicking on them.
      </div>
    </div>

    <div class="relative border border-gray-200 p-4">
      <div class="border border-gray-200 p-2 w-full">
        <small>Choose Customer</small>
        <input
          v-model="search"
          type="text"
          @focus="onInputFocus"
          @click="onInputFocus"
          id="customer"
          class="block mt-1 w-full text-gray-900 border-0 rounded-xs text-2xl focus:ring-gray-400 focus:outline-none"
          autocomplete="off"
        />
      </div>

      <transition
        name="fade"
        enter-active-class="transition ease-out duration-150"
        leave-active-class="transition ease-in duration-100"
      >
        <div
          v-if="dropdownOpen"
          class="absolute left-0 z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-56 overflow-y-auto"
        >
          <ul>
            <li
              v-for="cust in filteredCustomers"
              :key="cust.customerId"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-base"
              @mousedown.prevent="pickCustomer(cust)"
            >
              {{ cust.name }}
            </li>
            <li v-if="filteredCustomers.length === 0" class="px-4 py-2 text-gray-500 text-sm">
              No customers found
            </li>
          </ul>
        </div>
      </transition>

      <div v-if="selectedCustomer" class="border rounded mt-4 bg-gray-50 p-4 space-y-2">
        <div class="flex gap-10">
          <div>
            <small class="text-xs">Credit Limit</small>
            <p class="font-medium text-xl">{{ formatCurrency(selectedCustomer.creditLimit) }}</p>
          </div>
          <div>
            <small class="text-xs">Wallet Balance</small>
            <p class="font-medium text-xl">
              {{ formatCurrency(selectedCustomer.customerWallet.balance) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="selectedCustomer" class="bg-white rounded border border-gray-200 p-4">
    <table class="w-full mb-4 border-t border-b">
      <thead class="text-xs">
        <tr>
          <th class="py-2 text-left font-medium">Product</th>
          <th class="py-2 text-left font-medium">Variant</th>
          <th class="py-2 text-left font-medium">Unit Price</th>
          <th class="py-2 text-left font-medium">Weight</th>
          <th class="py-2 text-left font-medium">Quantity</th>
          <th class="py-2 text-left font-medium">Discount</th>
          <th class="py-2 text-left font-medium">Total</th>
          <th class="py-2 text-left font-medium"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in rows" :key="idx" class="odd:bg-gray-50">
          <td>
            <select
              v-model="row.productId"
              @change="onProductSelect(row)"
              class="p-1 border rounded w-full"
            >
              <option disabled value="">Pick product…</option>
              <option v-for="p in productOptions" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </td>
          <td>
            <select
              v-model="row.variantId"
              @change="onVariantSelect(row)"
              class="p-1 border rounded w-full"
              :disabled="!row.variants.length"
            >
              <option disabled value="">Pick variant…</option>
              <option v-for="v in row.variants" :key="v.id" :value="v.id">
                {{ v.name }} ({{ v.weight }}kg)
              </option>
            </select>
          </td>
          <td>
            <span class="inline-block w-full">{{ formatCurrencyTrans(row.unitPriceDisplay) }}</span>
          </td>
          <td>
            <span class="inline-block w-full">{{ row.variantWeight ?? '—' }}</span>
          </td>
          <td>
            <input
              type="number"
              v-model.number="row.quantity"
              min="1"
              class="p-1 border rounded w-full"
            />
          </td>
          <td>
            <input
              type="number"
              v-model.number="row.lineDiscount"
              min="0"
              class="p-1 border rounded w-full"
            />
          </td>
          <td>
            <span class="font-semibold">{{ formatCurrencyTrans(rowTotal(row)) }}</span>
          </td>
          <td>
            <secondary-button
              @click="removeRow(idx)"
              :disabled="rows.length === 1"
              class="text-red-500"
              ><span class="material-symbols-outlined"> close </span></secondary-button
            >
          </td>
        </tr>
      </tbody>
    </table>

    <secondary-button @click="addRow" class="flex items-center">
      <span class="material-symbols-outlined"> add </span>
      Add Product</secondary-button
    >

    <div class="text-right">
      <div>
        <small class="text-sm">Grand Total</small>
        <p class="font-bold text-2xl">{{ formatCurrencyTrans(grandTotal) }}</p>
      </div>
    </div>
    <div class="mt-4 text-right">
      <primary-button @click="onSubmit">Submit Transaction</primary-button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
