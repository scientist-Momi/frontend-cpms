<script setup>
import { useModalStore } from '@/stores/modalStore'
import { useFunction } from '@/composables/useFunction'

const modal = useModalStore()
const { formatCurrencyTrans } = useFunction()

const dataReceived = modal.data
const variantsMap = dataReceived.variantsMap
const productOptions = dataReceived.productOptions
const rows = dataReceived.rows
const grandTotal = dataReceived.grandTotal
const payload = dataReceived.payload

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
  <div class="bg-white p-6 rounded shadow max-w-lg mx-auto">
    <h2 class="text-xl font-semibold mb-4">Confirm Purchase</h2>
    {{ payload }}

    <table class="w-full border-collapse mb-4">
      <thead>
        <tr>
          <th class="border p-2 text-left">Product</th>
          <th class="border p-2 text-left">Variant</th>
          <th class="border p-2 text-left">Quantity</th>
          <th class="border p-2 text-left">Unit Price</th>
          <th class="border p-2 text-left">Discount</th>
          <th class="border p-2 text-left">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in rows" :key="idx" class="odd:bg-gray-50">
          <td class="border p-2">{{ getProductName(row.productId) }}</td>
          <td class="border p-2">{{ getVariantWeight(row.variantId) }}</td>
          <td class="border p-2">{{ row.quantity }}</td>
          <td class="border p-2">{{ formatCurrencyTrans(row.unitPrice) }}</td>
          <td class="border p-2">{{ formatCurrencyTrans(row.lineDiscount) }}</td>
          <td class="border p-2">{{ formatCurrencyTrans(rowTotal(row)) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="text-right font-bold mb-4">Grand Total: {{ formatCurrencyTrans(grandTotal) }}</div>

    <div class="flex justify-end gap-4">
      <button @click="closeModal" class="px-4 py-2 border rounded">Cancel</button>
      <button @click="confirmPurchase" class="px-4 py-2 bg-blue-600 text-white rounded">
        Confirm
      </button>
    </div>
  </div>
</template>
