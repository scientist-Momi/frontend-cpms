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

const isReasonStage = ref(false)
const returnReason = ref('')

function proceedToReason() {
  if (selectedDetails.value.length === 0) {
    toast.showToast({ message: 'Please select at least one product to return.', type: 'error' })
    return
  }
  isReasonStage.value = true
}

function goBackToSelection() {
  isReasonStage.value = false
}

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
  detail.returnQuantity = val
}

function calcLineRefund(detail) {
  const qty = detail.returnQuantity || 0
  return qty * (detail.unitPrice - (detail.lineDiscount || 0)) * detail.variant.weight
}

const totalRefund = computed(() =>
  selectedDetails.value.reduce((sum, d) => sum + calcLineRefund(d), 0),
)

function lineTotal(tx) {
  const unitPrice = tx.unitPrice || 0
  const weight = tx.variant.weight || 0
  const quantity = tx.quantity || 0
  const discount = tx.lineDiscount || 0
  return weight * unitPrice * quantity - discount
}

function validateReturn() {
  for (const item of selectedDetails.value) {
    if (!item.returnQuantity || item.returnQuantity < 1) {
      toast.showToast({ message: `Invalid quantity for ${item.product.name}`, type: 'error' })
    }
    if (item.returnQuantity > item.quantity - (item.alreadyReturned || 0)) {
      toast.showToast({
        message: `Return quantity for ${item.product.name} exceeds allowable amount`,
        type: 'error',
      })
    }
  }
  // proceed with submission
}

async function submitReturn() {
  try {
    // Here you can validate quantities if you like (on submit)
    validateReturn()
    // Prepare payload from selectedDetails & returnReason
    const payload = {
      transactionId: transaction.value.transactionId,
      customerId: transaction.value.customer.id,
      reason: returnReason.value,
      details: selectedDetails.value.map(d => ({
        detailId: d.detailId,
        quantity: d.returnQuantity,
        // add other needed fields
      })),
    }
    // Call your API to process return
    // await api.submitReturn(payload)

    toast.showToast({ message: 'Return submitted successfully!', type: 'success' })
    // Reset
    isReasonStage.value = false
    selectedDetails.value = []
    returnReason.value = ''
    // Optionally refresh transaction data etc.
  } catch (e) {
    toast.showToast({ message: e.message || 'Failed to submit return', type: 'error' })
  }
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
        <template v-if="!isReasonStage">
          <small>Select the transaction details you want to return:</small>
          <div class="flex flex-wrap gap-2 rounded border border-gray-200 p-2 mb-4">
            <div
              v-for="tx in transaction.transactionDetails"
              :key="tx.detailId"
              @click="toggleSelect(tx)"
              class="border border-gray-200 p-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
              :class="{
                'bg-blue-100 border-blue-300': selectedDetails.some(
                  (d) => d.detailId === tx.detailId,
                ),
                'opacity-50 pointer-events-none': selectedDetails.some(
                  (d) => d.detailId === tx.detailId,
                ),
              }"
            >
              {{ tx.product.name }} - {{ tx.variant.weight }}kg<br />
              <small>Qty: {{ tx.quantity }}, {{ formatCurrency(lineTotal(tx)) }}</small>
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
                <td class="p-2">
                  <h3>{{ detail.product.name }} - {{ detail.variant.weight }}kg</h3>
                  <h3>{{ detail.quantity }} units</h3>
                  <h3 class="font-bold">
                    @ {{ formatCurrency(detail.variant.weight * detail.unitPrice) }} each
                  </h3>
                </td>
                <td class="p-2">{{ formatCurrency(lineTotal(detail)) }}</td>
                <td class="p-2">{{ formatCurrency(detail.lineDiscount || 0) }}</td>
                <td class="p-2">
                  <input
                    type="text"
                    v-model.number="detail.returnQuantity"
                    @input="updateQuantity(detail, detail.returnQuantity)"
                    class="w-16 border rounded p-2 text-center hide-arrows"
                    placeholder="Qty"
                  />
                </td>

                <td class="p-2 font-bold">{{ formatCurrency(calcLineRefund(detail)) }}</td>
                <td class="p-2">
                  <button
                    @click="toggleSelect(detail)"
                    class="text-red-600 hover:underline text-xs"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="text-right p-2 font-medium">Total Refund:</td>
                <td class="p-2 font-bold text-blue-600">{{ formatCurrency(totalRefund) }}</td>
              </tr>
            </tfoot>
          </table>
          <PrimaryButton @click="proceedToReason">Proceed</PrimaryButton>
        </template>
        <template v-else>
          <label for="reason" class="block mb-2 font-semibold">Reason for return:</label>
          <textarea
            id="reason"
            v-model="returnReason"
            rows="4"
            class="w-full border rounded p-2 mb-4"
            placeholder="Enter reason for return"
          ></textarea>
          <div class="flex gap-3">
            <SecondaryButton @click="goBackToSelection">Back</SecondaryButton>
            <PrimaryButton :disabled="!returnReason.trim()" @click="submitReturn"
              >Submit Return</PrimaryButton
            >
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
