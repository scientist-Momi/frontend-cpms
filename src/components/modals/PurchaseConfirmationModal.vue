<script setup>
import { ref } from 'vue'
import { useModalStore } from '@/stores/modalStore'
import { useFunction } from '@/composables/useFunction'
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'
import { useCustomer } from '@/composables/useCustomer'
import { useTransaction } from '@/composables/useTransaction'
import { useProduct } from '@/composables/useProduct'
import { useToastStore } from '@/stores/toastStore'
import { useRouter } from 'vue-router'
import jsPDF from 'jspdf'
import PageLoader from '../PageLoader.vue'

const pdfPreviewUrl = ref(null)

const modal = useModalStore()
const { formatCurrencyTrans, getCustomerInitials } = useFunction()
const { createTransaction, fetchTransactions } = useTransaction()
const { fetchCustomers } = useCustomer()
const { fetchProducts } = useProduct()
const toast = useToastStore()
const router = useRouter()
const loading = ref(false)

const dataReceived = modal.data
const variantsMap = dataReceived.variantsMap
const productOptions = dataReceived.productOptions
const rows = dataReceived.rows
const grandTotal = dataReceived.grandTotal
const payload = dataReceived.payload
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

// function confirmPurchase(){
//   handleSubmit()
//   generateInvoice()
// }

function generateInvoice() {
  const doc = new jsPDF('p', 'pt', 'a4')
  const marginLeft = 40
  let y = 60

  // --- Header ---
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text('Invoice from Qwaklan Inc.', marginLeft, y)

  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text(
    `ID: #${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}`,
    marginLeft,
    y + 16,
  )

  doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, marginLeft + 350, y)
  doc.text(
    `Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    marginLeft + 350,
    y + 16,
  )

  // --- Bill From / Bill To ---
  y += 60
  doc.setFontSize(11)
  doc.setTextColor(120, 120, 120)
  doc.text('Bill from:', marginLeft, y)
  doc.text('Bill to:', marginLeft + 300, y)

  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  doc.text('Qwaklan Inc', marginLeft, y + 16)
  doc.text('25/385 Palatial Road, South Mascot, 2026', marginLeft, y + 32)

  doc.text(customer.name, marginLeft + 300, y + 16)
  doc.text(customer.email, marginLeft + 300, y + 32)

  // --- Table Header ---
  y += 80
  doc.setFillColor(245, 245, 245)
  doc.rect(marginLeft, y, 500, 24, 'F')

  doc.setFontSize(11)
  doc.setTextColor(120, 120, 120)
  doc.text('Item', marginLeft + 8, y + 16)
  doc.text('QTY', marginLeft + 280, y + 16)
  doc.text('Rate', marginLeft + 340, y + 16)
  doc.text('Amount', marginLeft + 420, y + 16)

  y += 32
  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  rows.forEach((row, idx) => {
    const rowY = y + idx * 22
    doc.text(
      `${getProductName(row.productId)} - ${getVariantWeight(row.variantId)}kg`,
      marginLeft + 8,
      rowY,
    )
    doc.text(`${row.quantity}`, marginLeft + 280, rowY)
    doc.text(`${formatCurrencyTrans(row.unitPrice)}`, marginLeft + 340, rowY)
    doc.text(`${formatCurrencyTrans(rowTotal(row))}`, marginLeft + 420, rowY)
  })

  // --- Summary ---
  const subtotal = rows.reduce((sum, row) => sum + rowTotal(row), 0)
  const discount = 0
  const tax = 0
  // const total = subtotal + tax

  let summaryY = y + rows.length * 22 + 40
  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text('Subtotal', marginLeft + 340, summaryY)
  doc.text('Discount', marginLeft + 340, summaryY + 16)
  doc.text('Tax', marginLeft + 340, summaryY + 32)

  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  doc.text(formatCurrencyTrans(subtotal), marginLeft + 420, summaryY)
  doc.text(`${discount}%`, marginLeft + 420, summaryY + 16)
  doc.text(formatCurrencyTrans(tax), marginLeft + 420, summaryY + 32)

  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('Total', marginLeft + 340, summaryY + 56)
  doc.setFontSize(14)
  doc.text(formatCurrencyTrans(grandTotal), marginLeft + 420, summaryY + 56)

  // --- Footer ---
  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text('Thank you for your business!', marginLeft, summaryY + 90)

  // --- Preview ---
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

function showSummary() {
  if (pdfPreviewUrl.value) {
    URL.revokeObjectURL(pdfPreviewUrl.value)
    pdfPreviewUrl.value = null
  }
}

function finishAndSend() {
  closeModal()
  router.push({ name: 'Transactions' })
}

const handleSubmit = async () => {
  const res = await createTransaction(payload)
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 2500))
  if (res.success) {
    loading.value = false
    await fetchTransactions()
    await fetchCustomers()
    await fetchProducts()
    toast.showToast({
      message: 'Transaction has been saved!',
      type: 'success',
    })
    generateInvoice()
    // router.push({ name: 'Transactions' })
  } else {
    loading.value = false
    toast.showToast({
      message: res.message || 'Failed to save transaction.',
      type: 'error',
    })
    showSummary()
  }
}
</script>

<template>
  <div v-if="loading">
    <PageLoader />
  </div>
  <div v-else class="overflow-y-scroll max-h-fit">
    <div class="bg-white p-6 px-6 py-3">
      <div v-if="pdfPreviewUrl" class="mt-6 border rounded" style="height: 600px">
        <div class="flex justify-center items-center h-full overflow-hidden">
          <embed :src="pdfPreviewUrl" type="application/pdf" width="80%" height="100%" />
        </div>
      </div>
      <div v-if="pdfPreviewUrl" class="flex gap-4 mt-8">
        <SecondaryButton @click="showSummary"> Back </SecondaryButton>
        <PrimaryButton @click="finishAndSend"> Finish & Send to Customer </PrimaryButton>
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in rows" :key="idx" class="border-b">
              <td class="text-sm py-2">
                {{ row.quantity }} x {{ getProductName(row.productId) }} -
                {{ getVariantWeight(row.variantId) }}kg
              </td>
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
            >Edit Transaction</SecondaryButton
          >
          <PrimaryButton @click="handleSubmit" class="px-4 py-2 bg-blue-600 text-white rounded">
            Proceed & Generate Invoice
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>
