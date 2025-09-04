<script setup>
import { useModalStore } from '@/stores/modalStore'
import { useFunction } from '@/composables/useFunction'

const modal = useModalStore()
const { formatCurrencyTrans, getCustomerInitials } = useFunction()

const dataReceived = modal.data
const variantsMap = dataReceived.variantsMap
const productOptions = dataReceived.productOptions
const rows = dataReceived.rows
const grandTotal = dataReceived.grandTotal
// const payload = dataReceived.payload
const customer = dataReceived.selectedCustomer

function getProductName(productId) {
  const productsArray = productOptions && (productOptions.value || productOptions)
  if (!Array.isArray(productsArray)) return 'Unknown Product'

  const product = productsArray.find((p) => p.id === productId)
  return product ? product.name : 'Unknown Product'
}

function getVariantWeight(variantId) {
  if (!variantsMap) return 'Unknown'
  const map = variantsMap.value || variantsMap
  return map.get(variantId)?.weight || 'Unknown'
}

function rowTotal(row) {
  const w = +row.variantWeight || 0
  const p = +row.unitPrice || 0
  const q = +row.quantity || 0
  const d = +row.lineDiscount || 0
  return w * p * q - d
}
</script>

<template>
  <div class="overflow-y-scroll max-h-fit">
    <div class="bg-white p-6 px-6 py-3">
      <div class="flex gap-2">
        <div class="rounded-xs bg-red-500 p-4 text-xl text-white font-semibold">
          {{ getCustomerInitials(customer.name) }}
        </div>
        <div class="">
          <p class="text-xl font-semibold">{{ customer.name }}</p>
        </div>
      </div>

      <table class="w-full border-collapse mb-2">
        <thead>
          <tr>
            <th class="py-1 font-semibold text-left text-sm">Product</th>
            <th class="py-2 text-right"></th>
            <!-- <th class="border p-2 text-left">Quantity</th>
          <th class="border p-2 text-left">Unit Price</th>
          <th class="border p-2 text-left">Discount</th>
          <th class="border p-2 text-left">Total</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in rows" :key="idx" class="border-b">
            <td class="text-sm py-2">
              {{ row.quantity }} x {{ getProductName(row.productId) }} -
              {{ getVariantWeight(row.variantId) }}kg
            </td>
            <!-- <td class="border p-2">{{ getVariantWeight(row.variantId) }}</td>
          <td class="border p-2">{{ row.quantity }}</td>
          <td class="border p-2">{{ formatCurrencyTrans(row.unitPrice) }}</td>
          <td class="border p-2">{{ formatCurrencyTrans(row.lineDiscount) }}</td> -->
            <td class="text-sm text-right py-2">{{ formatCurrencyTrans(rowTotal(row)) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="text-right text-sm items-center font-semibold mb-4 flex justify-between">
        <p>Total</p>
        <p>{{ formatCurrencyTrans(grandTotal) }}</p>
      </div>

      <div class="flex justify-end gap-4">
        <button @click="closeModal" class="px-4 py-2 border rounded">Cancel</button>
        <button @click="confirmPurchase" class="px-4 py-2 bg-blue-600 text-white rounded">
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>
