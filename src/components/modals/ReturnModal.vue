<script setup>
import { ref, onMounted, computed } from 'vue'
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'
import PageLoader from '../PageLoader.vue'
import { useModalStore } from '@/stores/modalStore'
import { useToastStore } from '@/stores/toastStore'
import { useTransaction } from '@/composables/useTransaction'
import { useFunction } from '@/composables/useFunction'

const toast = useToastStore()
const { fetchTransaction } = useTransaction()
const { formatCurrency } = useFunction()
const loading = ref(false)
const modal = useModalStore()
const transaction = ref(null)
const selectedDetails = ref([])

onMounted(async () => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const res = await fetchTransaction(modal.data)
  transaction.value = res.data
  loading.value = false
})

function toggleSelect(txDetail) {
  const idx = selectedDetails.value.findIndex((d) => d.detailId === txDetail.detailId)
  if (idx > -1) {
    selectedDetails.value.splice(idx, 1)
  } else {
    selectedDetails.value.push({
      ...txDetail,
      returnQuantity: 1,
    })
  }
}

function updateQuantity(detail, val) {
  detail.returnQuantity = Math.max(
    1,
    Math.min(val, detail.quantity - (detail.alreadyReturned || 0)),
  )
}

function calcLineRefund(detail) {
  const qty = detail.returnQuantity || 0
  return qty * (detail.unitPrice - (detail.lineDiscount || 0)) * detail.variant.weight
}

const totalRefund = computed(() =>
  selectedDetails.value.reduce((sum, d) => sum + calcLineRefund(d), 0),
)

function lineTotal(tx) {
  const unitPrice = tx.unitPrice || 0;
  const weight = tx.variant.weight || 0;
  const quantity = tx.quantity || 0;
  const discount = tx.lineDiscount || 0;
  return (weight * unitPrice * quantity) - discount;
}
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
        <small>Select the transaction details you want to return:</small>
        <div class="flex flex-wrap gap-2 rounded border border-gray-200 p-2 mb-4">
          <div
            v-for="tx in transaction.transactionDetails"
            :key="tx.detailId"
            @click="toggleSelect(tx)"
            class="border border-gray-200 p-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
            :class="
              selectedDetails.some((d) => d.detailId === tx.detailId)
                ? 'bg-blue-100 border-blue-300'
                : ''
            "
          >
            {{ tx.product.name }} - {{ tx.variant.weight }}kg<br />
            <small>Qty: {{ tx.quantity }}, {{ formatCurrency(lineTotal(tx))}}</small>
          </div>
        </div>

        <!-- Selected return table -->
        <table v-if="selectedDetails.length" class="w-full text-left border">
          <thead class="text-xs border-b border-gray-200">
            <tr>
              <th class="px-2 py-2 font-medium">Product</th>

              <th class="px-2 py-2 font-medium">Unit Total</th>
              <th class="px-2 py-2 font-medium">Line Discount</th>
              <th class="px-2 py-2 font-medium">Qty to return</th>
              <th class="px-2 py-2 font-medium">Refund Price</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr
              v-for="detail in selectedDetails"
              :key="detail.detailId"
              class="border-b border-gray-200"
            >
              <td class="p-2"><h3>{{ detail.product.name }} - {{ detail.variant.weight }}kg</h3>
                <h3>{{ detail.quantity }} units</h3>
                <h3>@ {{ formatCurrency((detail.variant.weight) * (detail.unitPrice))}} each</h3>
              </td>
              <td class="p-2">{{ formatCurrency(lineTotal(detail)) }}</td>
              <td class="p-2">{{ formatCurrency(detail.lineDiscount || 0) }}</td>
              <td class="p-2">
                <input
                  type="number"
                  min="1"
                  :max="detail.quantity - (detail.alreadyReturned || 0)"
                  v-model.number="detail.returnQuantity"
                  @input="updateQuantity(detail, detail.returnQuantity)"
                  class="w-16 border rounded px-1"
                />
              </td>

              <td class="p-2 font-bold">{{ formatCurrency(calcLineRefund(detail)) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7" class="text-right p-2 font-medium">Total Refund:</td>
              <td class="p-2 font-bold text-blue-600">{{ formatCurrency(totalRefund) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
