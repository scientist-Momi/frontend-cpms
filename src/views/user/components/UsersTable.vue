<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ReusableFilter from '@/components/ReusableFilter.vue'
import { useAuthStore } from '@/stores/authStore'
import { useModalStore } from '@/stores/modalStore'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

const auth = useAuthStore()
const modal = useModalStore()
const users = ref([])

onMounted(() => {
  // Assign the users from the store to the ref
  users.value = auth.users
})

const statusFilter = ref('all')
const statusFilterOptions = ref([
  { value: 'all', label: 'All', icon: 'list', iconClass: 'text-gray-400', count: 0 },
  { value: 'active', label: 'Active', icon: 'check_circle', iconClass: 'text-green-500', count: 0 },
  { value: 'inactive', label: 'Inactive', icon: 'cancel', iconClass: 'text-red-500', count: 0 },
])
const search = ref('')
const selected = ref([])

function updateStatusCounts(users) {
  const total = users.length
  const active = users.filter((u) => u.enabled).length
  const inactive = users.filter((u) => !u.enabled).length
  statusFilterOptions.value = statusFilterOptions.value.map((opt) => {
    if (opt.value === 'all') return { ...opt, count: total }
    if (opt.value === 'active') return { ...opt, count: active }
    if (opt.value === 'inactive') return { ...opt, count: inactive }
    return opt
  })
}

watch(
  users,
  (newUsers) => {
    updateStatusCounts(newUsers)
  },
  { immediate: true },
)

const currentPage = ref(1)
const rowsPerPage = ref(12)

const rowsPerPageOptions = [12, 20, 50]

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredUsers.value.length / rowsPerPage.value)),
)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return filteredUsers.value.slice(start, end)
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
  currentPage.value = 1 // Reset to first page
}

const filteredUsers = computed(() => {
  let arr = users.value
  if (statusFilter.value !== 'all') {
    arr = arr.filter((u) => (statusFilter.value === 'active' ? u.enabled : !u.enabled))
  }
  if (search.value.trim()) {
    arr = arr.filter(
      (u) =>
        u.fullName.toLowerCase().includes(search.value.toLowerCase()) ||
        u.email.toLowerCase().includes(search.value.toLowerCase()) ||
        u.phone.includes(search.value),
    )
  }
  return arr
})

function toggleAll(e) {
  if (e.target.checked) {
    selected.value = users.value.map((user) => user.id)
  } else {
    selected.value = []
  }
}

function toggleRow(userId) {
  if (selected.value.includes(userId)) {
    selected.value = selected.value.filter((id) => id !== userId)
  } else {
    selected.value.push(userId)
  }
}

watch([statusFilter, search], () => {
  currentPage.value = 1
})

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>

<template>
  <div class="bg-white rounded shadow border border-gray-200">
    <div class="flex items-center p-4 border-b border-gray-200 gap-2 justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined"> group </span>
        <p class="font-semibold">Current Users</p>
      </div>
    </div>
    <div class="flex justify-between items-center gap-2 mb-4 border-b border-gray-200 p-4">
      <input
        v-model="search"
        type="text"
        placeholder="Filter users..."
        class="border border-gray-200 rounded px-3 py-2 w-1/3 text-sm focus:outline-none focus:ring-0 shadow-xs"
      />
      <div class="flex gap-2">
        <ReusableFilter label="Status" :options="statusFilterOptions" v-model="statusFilter" icon="arming_countdown" />
        <PrimaryButton v-if="selected.length > 0" @click="modal.open('user_delete', null, selected)">Delete User(s)</PrimaryButton>
      </div>
    </div>
    <div class="max-h-[30rem] overflow-y-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-gray-100 text-gray-500">
            <th class="sticky top-0 bg-white z-10 px-2 py-2">
              <input
                type="checkbox"
                :checked="users.length > 0 && selected.length === users.length"
                @change="toggleAll"
              />
            </th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">#</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Name</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Email</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Phone</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Role</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Status</th>
            <th class="sticky top-0 bg-white z-10 px-2 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, idx) in paginatedUsers"
            :key="user.email"
            class="border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <!-- Use the correct index for selection -->
            <td class="px-2 py-2">
              <input
                type="checkbox"
                :checked="selected.includes(user.id)"
                @change="() => toggleRow(user.id)"
              />
            </td>
            <td class="px-2 py-2 font-semibold text-gray-700">
              {{ (currentPage - 1) * rowsPerPage + idx + 1 }}
            </td>
            <router-link :to="{ name: 'UserView', params: { id: user.id } }">
              <td class="px-2 pt-2 font-medium">{{ user.fullName }}</td>
            </router-link>
            <td class="px-2 py-2">{{ user.email }}</td>
            <td class="px-2 py-2">{{ user.phone }}</td>
            <td class="px-2 py-2">
              <span
                :class="[
                  'text-xs font-semibold rounded px-2 py-0.5',
                  user.role === 'MAIN_ADMIN'
                    ? 'bg-blue-100 text-blue-700'
                    : user.role === 'MINOR_ADMIN'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700',
                ]"
              >
                {{ user.role.replace('_', ' ') }}
              </span>
            </td>
            <td class="px-2 py-2">
              <span
                :class="user.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="text-xs font-semibold rounded px-2 py-0.5"
              >
                {{ user.enabled ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-2 py-2">{{ formatDate(user.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="flex items-center justify-between text-sm text-gray-500 px-4 py-4 border-t border-gray-200"
    >
      <span>{{ selected.length }} of {{ filteredUsers.length }} row(s) selected.</span>
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
