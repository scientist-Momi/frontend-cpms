<script setup>
import { computed } from 'vue'
import { useCustomerStore } from '@/stores/customerStore'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const customers = useCustomerStore()
const recentCustomers = computed(() => {
  return [...customers.customers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})
</script>

<template>
  <div class="border border-gray-200 rounded w-full">
    <div class="flex items-center p-4 border-b border-gray-200 gap-2 justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined"> acute </span>
        <p class="font-semibold">Latest Customers</p>
      </div>
      <SecondaryButton @click="router.push({ name: 'Customers' })"> View all </SecondaryButton>
    </div>
    <table class="w-full text-left table-auto border-collapse">
      <thead class="bg-blue-50 sticky top-0 z-10">
        <tr>
          <th class="px-4 py-3 font-semibold text-sm text-gray-700">#</th>
          <th class="px-4 py-3 font-semibold text-sm text-gray-700">Name</th>
          <th class="px-4 py-3 font-semibold text-sm text-gray-700">Email</th>
          <th class="px-4 py-3 font-semibold text-sm text-gray-700">Date Joined</th>
        </tr>
      </thead>
      <tbody class="text-gray-700 text-sm">
        <tr
          v-for="(customer, index) in recentCustomers"
          :key="customer.id"
          :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
          class="hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <td class="px-4 py-3 font-medium text-center">{{ index + 1 }}</td>
          <td class="px-4 py-3">{{ customer.name }}</td>
          <td class="px-4 py-3">{{ customer.email }}</td>
          <td class="px-4 py-3">{{ new Date(customer.createdAt).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
