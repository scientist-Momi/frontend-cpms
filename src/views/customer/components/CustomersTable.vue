<script setup>
import { ref, computed, watch } from 'vue'
import { useCustomerStore } from '@/stores/customerStore'
import ReusableFilter from '@/components/ReusableFilter.vue'

const customerStore = useCustomerStore()
const search = ref('')
const selected = ref([])
const customers = computed(() => customerStore.customers)
const typeFilter = ref('all')
const statusFilter = ref('all')
const statusFilterOptions = ref([
  { value: 'all', label: 'All', icon: 'list', iconClass: 'text-gray-400', count: 0 },
  { value: 'ACTIVE', label: 'Active', icon: 'check_circle', iconClass: 'text-green-500', count: 0 },
  { value: 'DORMANT', label: 'Dormant', icon: 'cancel', iconClass: 'text-red-500', count: 0 },
])

const typeFilterOptions = ref([
  { value: 'all', label: 'All', icon: 'list', iconClass: 'text-gray-400', count: 0 },
  {
    value: 'WHOLESALER',
    label: 'Wholesaler',
    icon: 'delivery_truck_speed',
    iconClass: 'text-purple-500',
    count: 0,
  },
  { value: 'RETAILER', label: 'Retailer', icon: 'trolley', iconClass: 'text-orange-500', count: 0 },
  {
    value: 'CONSUMER',
    label: 'Consumer',
    icon: 'local_mall',
    iconClass: 'text-blue-500',
    count: 0,
  },
])

function updateStatusCounts(customers) {
  const total = customers.length
  const active = customers.filter((u) => u.status === 'ACTIVE').length
  const dormant = customers.filter((u) => u.status === 'DORMANT').length
  statusFilterOptions.value = statusFilterOptions.value.map((opt) => {
    if (opt.value === 'all') return { ...opt, count: total }
    if (opt.value === 'ACTIVE') return { ...opt, count: active }
    if (opt.value === 'DORMANT') return { ...opt, count: dormant }
    return opt
  })
}

function updateTypeCounts(customers) {
  const total = customers.length
  const wholesaler = customers.filter((u) => u.customerType === 'WHOLESALER').length
  const retailer = customers.filter((u) => u.customerType === 'RETAILER').length
  const consumer = customers.filter((u) => u.customerType === 'CONSUMER').length
  typeFilterOptions.value = typeFilterOptions.value.map((opt) => {
    if (opt.value === 'all') return { ...opt, count: total }
    if (opt.value === 'WHOLESALER') return { ...opt, count: wholesaler }
    if (opt.value === 'RETAILER') return { ...opt, count: retailer }
    if (opt.value === 'CONSUMER') return { ...opt, count: consumer }
  })
}

watch(
  customers,
  (newCustomers) => {
    updateStatusCounts(newCustomers)
    updateTypeCounts(newCustomers)
  },
  { immediate: true },
)

const currentPage = ref(1)
const rowsPerPage = ref(10)
const rowsPerPageOptions = [10, 20, 50]

const filteredCustomers = computed(() => {
  let arr = customers.value
  if (statusFilter.value !== 'all') {
    arr = arr.filter((c) => c.status === statusFilter.value)
  }
  if (typeFilter.value !== 'all') {
    arr = arr.filter((c) => c.customerType === typeFilter.value)
  }
  if (search.value.trim()) {
    const s = search.value.toLowerCase()
    arr = arr.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.alias?.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.phone.includes(s) ||
        c.address?.toLowerCase().includes(s),
    )
  }
  return arr
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredCustomers.value.length / rowsPerPage.value)),
)

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  return filteredCustomers.value.slice(start, start + rowsPerPage.value)
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

function toggleAll(e) {
  if (e.target.checked) {
    selected.value = paginatedCustomers.value.map((c) => c.customerId)
  } else {
    selected.value = []
  }
}
function toggleRow(id) {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter((cid) => cid !== id)
  } else {
    selected.value.push(id)
  }
}

watch([statusFilter, search], () => {
  currentPage.value = 1
})

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatCurrency(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return '£' + num.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <div class="bg-white rounded shadow border border-gray-200">
    <!-- <div class="flex items-center p-4 border-b border-gray-200 gap-2 justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined"> groups </span>
        <p class="font-semibold">Customers</p>
      </div>
    </div> -->
    <div class="flex justify-between items-center gap-2 mb-4 border-b border-gray-200 p-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search customers..."
        class="border border-gray-200 rounded px-3 py-2 w-1/3 text-sm focus:outline-none focus:ring-0 shadow-xs"
      />
      <div class="flex gap-2">
        <ReusableFilter
          label="Status"
          v-model="statusFilter"
          :options="statusFilterOptions"
          icon="arming_countdown"
        />
        <ReusableFilter
          label="Type"
          v-model="typeFilter"
          :options="typeFilterOptions"
          icon="bookmark_flag"
        />
        <button
          v-if="selected.length > 0"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Delete Selected
        </button>
      </div>
    </div>
    <div class="max-h-[30rem] overflow-y-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-gray-100 text-gray-500">
            <th class="sticky top-0 bg-white z-10 px-2 py-2">
              <input
                type="checkbox"
                :checked="
                  paginatedCustomers.length > 0 &&
                  paginatedCustomers.every((c) => selected.includes(c.customerId))
                "
                @change="toggleAll"
              />
            </th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">#</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Name</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Email</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Phone</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Type</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Status</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Wallet Balance</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(customer, idx) in paginatedCustomers"
            :key="customer.customerId"
            class="border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <td class="px-2 py-2">
              <input
                type="checkbox"
                :checked="selected.includes(customer.customerId)"
                @change="() => toggleRow(customer.customerId)"
              />
            </td>
            <td class="px-2 py-2 font-semibold text-gray-700">
              {{ (currentPage - 1) * rowsPerPage + idx + 1 }}
            </td>
            <router-link :to="{ name: 'CustomerView', params: { id: customer.customerId } }">
              <td class="px-2 py-2 font-medium">{{ customer.name }}</td>
            </router-link>
            <td class="px-2 py-2">{{ customer.email }}</td>
            <td class="px-2 py-2">{{ customer.phone }}</td>
            <td class="px-2 py-2">
              <div
                v-if="customer.customerType === 'RETAILER'"
                class="px-2 rounded-md text-orange-600 py-1 flex items-center gap-1 shadow bg-orange-200 w-fit"
              >
                <span class="material-symbols-outlined"> trolley </span>
                {{ customer.customerType }}
              </div>
              <div
                v-else-if="customer.customerType === 'CONSUMER'"
                class="px-2 rounded-md text-blue-600 py-1 flex items-center gap-1 shadow bg-blue-200 w-fit"
              >
                <span class="material-symbols-outlined"> local_mall </span>
                {{ customer.customerType }}
              </div>
              <div
                v-else
                class="px-2 rounded-md text-purple-600 py-1 flex items-center gap-1 shadow bg-purple-200 w-fit"
              >
                <span class="material-symbols-outlined"> delivery_truck_speed </span>
                {{ customer.customerType }}
              </div>
            </td>
            <td class="px-2 py-2">
              <span
                :class="
                  customer.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
                class="text-xs font-semibold rounded px-2 py-0.5"
              >
                {{ customer.status }}
              </span>
            </td>
            <td class="text-sm font-medium">
              <div
                :class="{
                  'bg-green-100 px-2 py-2': customer.customerWallet?.balance >= 0,
                  'bg-red-100 px-2 py-2': customer.customerWallet?.balance < 0,
                }"
              >
                {{
                  customer.customerWallet ? formatCurrency(customer.customerWallet.balance) : 'N/A'
                }}
              </div>
            </td>

            <td class="px-2 py-2">{{ formatDate(customer.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="flex items-center justify-between text-sm text-gray-500 px-4 py-4 border-t border-gray-200"
    >
      <span>{{ selected.length }} of {{ filteredCustomers.length }} row(s) selected.</span>
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
