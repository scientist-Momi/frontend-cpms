<script setup>
import { ref, computed, watch } from 'vue'
import { useTransactionStore } from '@/stores/TransactionStore'
// import ReusableFilter from '@/components/ReusableFilter.vue'
import { useFunction } from '@/composables/useFunction'
import { useRouter } from 'vue-router'

const router = useRouter()

const { formatDateShort, formatCurrency, getCustomerInitials } = useFunction()

const transactionStore = useTransactionStore()
const search = ref('')
const transactions = computed(() => transactionStore.transactions)

const currentPage = ref(1)
const rowsPerPage = ref(10)
const rowsPerPageOptions = [10, 20, 50]

const filteredTransactions = computed(() => {
  let arr = transactions.value
  if (search.value.trim()) {
    const s = search.value.toLowerCase()
    arr = arr.filter((t) =>
      t.customerName?.toLowerCase().includes(s)
    )
  }
  return arr
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTransactions.value.length / rowsPerPage.value)),
)

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  return filteredTransactions.value.slice(start, start + rowsPerPage.value)
})

function goToPage(page) {
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
}
function nextPage() {
  goToPage(currentPage.value + 1)
}
function prevPage() {
  goToPage(currentPage.value - 1)
}
function firstPage() {
  goToPage(1)
}
function lastPage() {
  goToPage(totalPages.value)
}
function onRowsPerPageChange(e) {
  rowsPerPage.value = parseInt(e.target.value)
  currentPage.value = 1
}

watch([search], () => {
  currentPage.value = 1
})

function goToTransaction(id) {
  router.push({ name: 'TransactionView', params: { id } })
}

</script>

<template>
  <div class="bg-white rounded shadow border border-gray-200">
    <div class="flex justify-between items-center gap-2 mb-4 border-b border-gray-200 p-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search transactions..."
        class="border border-gray-200 rounded px-3 py-2 w-1/3 text-sm focus:outline-none focus:ring-0 shadow-xs"
      />
    </div>
    <div class="max-h-[30rem] overflow-y-auto px-4">
      <table class="w-full text-left">
        <thead class="text-xs">
          <tr class="border-b border-gray-100 text-gray-500">
            <th class="sticky top-0 bg-white z-10 px-2 py-2 font-medium">Date</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2 font-medium">Customer</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2 font-medium">Amount</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2 font-medium">Quantity</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2 font-medium">Discount</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr
            v-for="transaction in paginatedTransactions"
            :key="transaction.transactionId"
            class="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
            @click="goToTransaction(transaction.transactionId)"
          >
            <td class="p-2 py-3">{{ formatDateShort(transaction.createdAt) }}</td>
            <td class="p-2 py-3">
              <div class="flex items-center gap-2">
                <div class="rounded-full bg-red-500 p-2 text-sm text-white font-semibold">
                  {{ getCustomerInitials(transaction.customerName) }}
                </div>
                <p>{{ transaction.customerName }}</p>
              </div>
            </td>
            <td class="p-2 py-3">{{ formatCurrency(transaction.totalAmount) }}</td>
            <td class="p-2 py-3">{{ transaction.totalQuantity }}</td>
            <td class="p-2 py-3">{{ formatCurrency(transaction.totalDiscount) }}</td>
            <td v-if="transaction.hasReturned" class="p-2 py-3">
              <span class="material-symbols-outlined">
amend
</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="flex items-center justify-between text-sm text-gray-500 px-4 py-4 border-t border-gray-200"
    >
      <div class="flex items-center gap-2">
        <span>Rows per page</span>
        <select
          class="border border-gray-200 rounded px-1 py-0.5"
          :value="rowsPerPage"
          @change="onRowsPerPageChange"
        >
          <option v-for="opt in rowsPerPageOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="px-1" @click="firstPage" :disabled="currentPage === 1">&lt;&lt;</button>
        <button class="px-1" @click="prevPage" :disabled="currentPage === 1">&lt;</button>
        <button class="px-1" @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
        <button class="px-1" @click="lastPage" :disabled="currentPage === totalPages">
          &gt;&gt;
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
