<script setup>
import { ref, computed } from 'vue'
import SecondaryStatsCard from '@/components/SecondaryStatsCard.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
// import CustomerChart from '@/components/charts/CustomerChart.vue'
import CustomersTable from '../components/CustomersTable.vue'
import { useCustomerStore } from '@/stores/customerStore'
import { useRouter } from 'vue-router'
import BaseChart from '@/components/charts/BaseChart.vue'
const router = useRouter()

const customers = useCustomerStore()
const summary = customers.financialSummary
const totalRevenue = ref(summary.totalRevenue)
const totalDebts = ref(summary.outstandingDebts)
const totalPayments = ref(summary.totalPaymentsReceived)


const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return (
    '£' +
    num.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

const series = computed(() => {
  const sorted = customers.customers
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const dateCounts = {}
  sorted.forEach((cust) => {
    const date = cust.createdAt.slice(0, 10)
    dateCounts[date] = (dateCounts[date] || 0) + 1
  })

  const cumulative = []
  let total = 0
  Object.keys(dateCounts)
    .sort()
    .forEach((date) => {
      total += dateCounts[date]
      cumulative.push([new Date(date).getTime(), total])
    })

  return [
    {
      name: 'Customers',
      data: cumulative,
    },
  ]
})

// const chartSeries = [
//   {
//     name: 'Revenue',
//     data: [12000, 11000, 13000, 12500, 13500, 14000, 15000],
//     color: '#1A56DB',
//   },
//   {
//     name: 'Payments',
//     data: [9000, 9500, 10000, 9800, 10500, 11000, 12000],
//     color: '#7E3BF2',
//   },
//   {
//     name: 'Debts',
//     data: [3000, 2800, 2500, 2700, 2300, 2000, 1800],
//     color: '#FF4560',
//   },
// ]
// const chartCategories = ['01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb', '06 Feb', '07 Feb']
</script>

<template>
  <div>
    <div v-if="$route.name === 'Customers'">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">Customer Overview</h1>
        <div class="flex items-center gap-2">
          <SecondaryButton class="flex items-center gap-2">
            <span class="material-symbols-outlined"> file_save </span>
            <p>Export</p>
          </SecondaryButton>
          <PrimaryButton
            @click="router.push({ name: 'NewCustomer' })"
            class="flex items-center gap-2"
          >
            <span class="material-symbols-outlined"> person_add </span>
            <p>New Customer</p>
          </PrimaryButton>
        </div>
      </div>
      <div class="flex gap-6 mb-4">
        <SecondaryStatsCard
          label="Total Customers"
          :value="customers.customers.length"
          icon="groups"
        />
        <SecondaryStatsCard
          label="Total Revenue"
          :value="formatCurrency(totalRevenue)"
          icon="attach_money"
        />
        <SecondaryStatsCard
          label="Outstanding Debts"
          :value="formatCurrency(totalDebts)"
          icon="money_off"
        />
        <SecondaryStatsCard
          label="Total Payments Received"
          :value="formatCurrency(totalPayments)"
          icon="paid"
        />
      </div>
      <!-- <CustomerChart class="mb-4" :series="chartSeries" :categories="chartCategories">
        <template #summary-value>{{ formatCurrency(totalRevenue) }}</template>
        <template #summary-label>Revenue This Week</template>
        <template #trend-indicator>23%</template></CustomerChart
      > -->
      <div class="border-gray-200 border rounded p-2 mb-4">
        <BaseChart :series="series" title="Customers"/>
      </div>
      <CustomersTable />
    </div>
    <router-view />
  </div>
</template>

<style scoped></style>
