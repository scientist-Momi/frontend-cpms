<script setup>
import { ref, watch, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useTransactionStore } from '@/stores/TransactionStore'

const transactions = useTransactionStore()

function getProductTotalQuantity(transactionsArr) {
  const totalsMap = {}
  for (const tx of transactionsArr) {
    for (const detail of tx.transactionDetails) {
      const name = detail.product?.name || 'Unknown Product'
      if (!totalsMap[name]) {
        totalsMap[name] = 0
      }
      totalsMap[name] += detail.quantity || 0
    }
  }
  return Object.entries(totalsMap).map(([name, quantitySold]) => ({
    name,
    quantitySold,
  }))
}

const series = ref([
  {
    name: 'Quantity Sold',
    data: [],
  },
])

const chartOptions = ref({
  chart: {
    height: 300,
    type: 'bar',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      dataLabels: {
        position: 'top',
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => val.toLocaleString(),
    offsetY: -18,
    style: {
      fontSize: '12px',
      colors: ['#304758'],
    },
  },
  xaxis: {
    categories: [],
    position: 'bottom',
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: true },
    labels: {
      rotate: -15,
      style: { fontSize: '13px' },
    },
  },
  yaxis: {
    title: { text: 'Quantity Sold' },
    labels: {
      formatter: (val) => val.toLocaleString(),
    },
  },
  title: {
    text: 'Most Bought Products (by Quantity Sold)',
    align: 'left',
    style: { color: '#444', fontWeight: 600 },
  },
  legend: { show: true, position: 'top' },
  tooltip: {
    y: {
      formatter: (val) => val.toLocaleString(),
    },
  },
})

const productQuantityArray = computed(() => getProductTotalQuantity(transactions.transactions))

watch(
  productQuantityArray,
  (newArr) => {
    series.value[0].data = newArr.map((p) => p.quantitySold)
    chartOptions.value.xaxis.categories = newArr.map((p) => p.name)
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <VueApexCharts type="bar" height="300" :options="chartOptions" :series="series" />
  </div>
</template>
