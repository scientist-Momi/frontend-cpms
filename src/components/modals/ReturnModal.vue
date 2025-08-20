<script setup>
import { ref, onMounted, computed } from 'vue'
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
      returnQuantity: 1, // default
    })
  }
}

function updateQuantity(detail, val) {
  // Optionally clamp input to [1, maxReturnable]
  detail.returnQuantity = Math.max(
    1,
    Math.min(val, detail.quantity - (detail.alreadyReturned || 0)),
  )
}

function calcLineRefund(detail) {
  const qty = detail.returnQuantity || 0
  return qty * (detail.unitPrice - (detail.lineDiscount || 0))
}

const totalRefund = computed(() =>
  selectedDetails.value.reduce((sum, d) => sum + calcLineRefund(d), 0),
)
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
            <small>Qty: {{ tx.quantity }}, ₦{{ tx.unitPrice }}</small>
          </div>
        </div>

        <!-- Selected return table -->
        <table v-if="selectedDetails.length" class="w-full text-left border">
          <thead class="text-xs border-b border-gray-200">
            <tr>
              <th class="px-2 py-2 font-medium">Product</th>
              <th class="px-2 py-2 font-medium">Variant</th>
              <th class="px-2 py-2 font-medium">Qty bought</th>
              <th class="px-2 py-2 font-medium">Qty already returned</th>
              <th class="px-2 py-2 font-medium">Qty to return</th>
              <th class="px-2 py-2 font-medium">Unit Price</th>
              <th class="px-2 py-2 font-medium">Line Discount</th>
              <th class="px-2 py-2 font-medium">Refund for this line</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr
              v-for="detail in selectedDetails"
              :key="detail.detailId"
              class="border-b border-gray-200"
            >
              <td class="p-2">{{ detail.product.name }}</td>
              <td class="p-2">{{ detail.variant.weight }}kg</td>
              <td class="p-2">{{ detail.quantity }}</td>
              <td class="p-2">{{ detail.alreadyReturned || 0 }}</td>
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
              <td class="p-2">{{ formatCurrency(detail.unitPrice) }}</td>
              <td class="p-2">{{ formatCurrency(detail.lineDiscount || 0) }}</td>
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

<style scoped></style>
