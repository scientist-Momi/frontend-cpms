<script setup>
import { ref } from 'vue'
import { useModalStore } from '@/stores/modalStore'
import { useFunction } from '@/composables/useFunction'
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'
import jsPDF from 'jspdf'

const pdfPreviewUrl = ref(null)

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

function confirmPurchase() {
  const doc = new jsPDF()
  doc.text(`Invoice for ${customer.name}`, 10, 10)
  rows.forEach((row, idx) => {
    doc.text(
      `${row.quantity} x ${getProductName(row.productId)} - ${getVariantWeight(row.variantId)}kg: ${formatCurrencyTrans(rowTotal(row))}`,
      10,
      20 + idx * 10,
    )
  })
  doc.text(`Total: ${formatCurrencyTrans(grandTotal)}`, 10, 20 + rows.length * 10)

  // Generate PDF Blob and preview URL
  const pdfBlob = doc.output('blob')
  pdfPreviewUrl.value = URL.createObjectURL(pdfBlob)
}

function closeModal() {
  if (pdfPreviewUrl.value) {
    URL.revokeObjectURL(pdfPreviewUrl.value)
    pdfPreviewUrl.value = null
  }
  modal.close()
}
</script>

<template>
  <div class="overflow-y-scroll max-h-fit">
    <div class="bg-white p-6 px-6 py-3">
      <div v-if="pdfPreviewUrl" class="mt-6 border rounded overflow-hidden" style="height: 400px">
        <iframe :src="pdfPreviewUrl" width="100%" height="100%" style="border: none"></iframe>
      </div>
      <div v-else>
        <div class="flex gap-2">
          <div class="rounded-xs bg-red-500 p-4 text-xl text-white font-semibold">
            {{ getCustomerInitials(customer.name) }}
          </div>
          <div class="">
            <p class="text-xl font-semibold">{{ customer.name }}</p>
            <p class="text-sm">{{ customer.email }}</p>
          </div>
        </div>

        <table class="w-full border-collapse mb-2 mt-8">
          <thead>
            <tr>
              <th class="py-1 font-semibold text-left text-sm">Product summary</th>
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

        <div class="flex gap-4 mt-8">
          <SecondaryButton @click="closeModal" class="px-4 py-2 border rounded"
            >Edit</SecondaryButton
          >
          <PrimaryButton @click="confirmPurchase" class="px-4 py-2 bg-blue-600 text-white rounded">
            Proceed & Generate Invoice
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>
