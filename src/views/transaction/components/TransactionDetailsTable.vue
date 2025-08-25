<script setup>
import { ref, watch } from 'vue'
import { useFunction } from '@/composables/useFunction'
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()

const { formatCurrency } = useFunction()

const props = defineProps({
  purchaseTransactions: {
    type: Array,
    required: true,
  },
})

const transactions = ref([...props.purchaseTransactions])

watch(
  () => props.purchaseTransactions,
  (newVal) => {
    transactions.value = [...newVal]
  },
)

function lineTotal(tx) {
  const unitPrice = tx.unitPrice || 0 // assuming number or BigDecimal convertible
  const weight = tx.variant.weight || 0
  const quantity = tx.quantity || 0
  const discount = tx.lineDiscount || 0

  // Calculate line total: weight * unitPrice * quantity - discount
  return weight * unitPrice * quantity - discount
}
</script>

<template>
  <div class="px-14">
    <table class="w-full text-left">
      <thead class="text-xs border-b border-gray-200">
        <tr>
          <th class="px-2 py-2 font-medium">Product</th>
          <th class="px-2 py-2 font-medium">Unit Price</th>
          <th class="px-2 py-2 font-medium">Variant</th>
          <th class="px-2 py-2 font-medium">Quantity</th>
          <th class="px-2 py-2 font-medium">Discount</th>
          <th class="px-2 py-2 font-medium">Unit Total</th>
          <th class="px-2 py-2 font-medium">Quantity Returned</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="text-sm">
        <tr
          v-for="tx in purchaseTransactions"
          :key="tx.detailId"
          class="border-b border-gray-200 hover:bg-gray-50 transition"
        >
          <td class="p-2 py-3">{{ tx.product.name }}</td>
          <td class="p-2 py-3">{{ formatCurrency(tx.unitPrice) }}</td>
          <td class="p-2 py-3">{{ tx.variant.weight }}Kg</td>
          <td class="p-2 py-3">{{ (tx.quantity) }}</td>
          <td class="p-2 py-3">{{ formatCurrency(tx.lineDiscount) }}</td>
          <td class="p-2 py-3">{{ formatCurrency(lineTotal(tx)) }}</td>
          <td class="p-2 py-3">{{ tx.quantityReturned || 0 }}</td>
          <td
          @click="modal.open('return_drawer')"
          v-if="tx.quantityReturned"
           class="p-2 py-3"><span class="material-symbols-outlined cursor-pointer" title="Open return details"> outbound </span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
