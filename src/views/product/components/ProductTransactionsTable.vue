<script setup>
import { ref, watch } from 'vue'
import { useFunction } from '@/composables/useFunction'
import { useRouter } from 'vue-router'

const { formatDateShort, formatCurrency } = useFunction()
const router = useRouter()

const props = defineProps({
  productTransactions: {
    type: Array,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
})

const selectedProductId = ref(props.productId)

const transactions = ref([...props.productTransactions])

watch(
  () => props.productId,
  (newVal) => {
    selectedProductId.value = newVal
  },
)
</script>

<template>
  <div class="px-14">
    <table class="w-full text-left font-light">
      <thead class="text-xs border-b border-gray-200">
        <tr>
          <th class="px-2 py-2 font-medium">Date</th>
          <th class="px-2 py-2 font-medium">Description</th>
          <th class="px-2 py-2 font-medium">Total Amount</th>
          <th class="px-2 py-2 font-medium">Total Quantity</th>
          <th class="px-2 py-2 font-medium">Total Discount</th>
        </tr>
      </thead>
      <tbody v-if="transactions.length" class="text-sm">
        <template v-for="tx in transactions" :key="tx.transactionId">
          <!-- Main transaction row -->
          <tr
            @click="router.push({ name: 'TransactionView', params: { id: tx.transactionId } })"
            class="border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition"
          >
            <td class="p-2 py-3">{{ formatDateShort(tx.createdAt) }}</td>
            <td class="p-2 py-3 flex items-center gap-1">
              <span class="material-symbols-outlined text-green-600"> sell </span> Purchase of
              {{ tx.totalQuantity }} products totalling {{ formatCurrency(tx.totalAmount) }}.
            </td>
            <td class="p-2 py-3">{{ formatCurrency(tx.totalAmount) }}</td>
            <td class="p-2 py-3">{{ tx.totalQuantity }}</td>
            <td class="p-2 py-3">{{ formatCurrency(tx.totalDiscount) }}</td>
          </tr>

          <!-- Transaction details filtered to selected product -->
          <template
            v-for="detail in tx.transactionDetails.filter(
              (d) => d.productId.toString() === selectedProductId.toString(),
            )"
            :key="detail.detailId"
          >
            <tr class="bg-gray-200">
              <td class="relative p-0">
                <div class="border-l border-b ml-9 w-full border-gray-500 p-2"></div>
              </td>
              <td></td>
              <td class="p-2 py-3">
                {{ formatCurrency(detail.quantity * detail.unitPrice * detail.variant.weight) }}
              </td>
              <td class="p-2 py-3">{{ detail.quantity }} of {{ detail.variant.weight }}Kg</td>
              <td class="p-2 py-3">{{ formatCurrency(detail.lineDiscount) }}</td>
            </tr>
          </template>
        </template>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="5" class="py-16 text-center text-gray-400">
            <span class="material-symbols-outlined text-5xl mb-2">shopping_cart_off</span>
            <div>No product transactions found.</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
