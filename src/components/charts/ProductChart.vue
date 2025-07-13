
<script setup>
import { ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// Register ApexCharts component locally
// const components = { apexchart: VueApexCharts }

// Props: products array with each product having at least:
// { name: string, valueSold: number, totalPrice: number }
const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => [],
  },
})

// Reactive series and options
// const props = defineProps(['products'])

const series = ref([
  {
    name: 'Value Sold',
    data: [],
  },
  // {
  //   name: 'Total Price',
  //   data: [],
  // },
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
    title: { text: '£ Value' },
    labels: {
      formatter: (val) => '£' + val.toLocaleString(),
    },
  },
  title: {
    text: 'Most Bought Products (by Value Sold)',
    align: 'left',
    style: { color: '#444', fontWeight: 600 },
  },
  legend: { show: true, position: 'top' },
  tooltip: {
    y: {
      formatter: (val) => '£' + val.toLocaleString(),
    },
  },
})

// Update chart data when products prop changes
watch(
  () => props.products,
  (newProducts) => {
    chartOptions.value.xaxis.categories = newProducts.map((p) => p.name)
    series.value[0].data = newProducts.map((p) => p.valueSold)
    // series.value[1].data = newProducts.map((p) => p.totalPrice)
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <VueApexCharts type="bar" height="300" :options="chartOptions" :series="series" />
  </div>
</template>
