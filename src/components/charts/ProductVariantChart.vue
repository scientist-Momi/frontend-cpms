<script setup>
import { ref, watch, computed } from 'vue'
import ApexChart from 'vue3-apexcharts'

const props = defineProps({
  variantsData: {
    type: Array,
    required: true,
    default: () => [],
  },
})

// Compute chart data based on the passed prop
const categories = computed(() =>
  props.variantsData.map(item => `${item.weight}kg`)
)

const series = computed(() => [
  {
    name: 'Inventory',
    data: props.variantsData.map(item => item.inventory)
  }
])

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 380
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      distributed: true,
      horizontal: true,
      dataLabels: {
        position: 'bottom'
      }
    }
  },
  colors: [
    '#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B',
    '#2b908f', '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7'
  ],
  dataLabels: {
    enabled: true,
    textAnchor: 'start',
    style: { colors: ['#fff'] },
    formatter(val, opt) {
      return `${categories.value[opt.dataPointIndex]}: ${val}`
    },
    offsetX: 0,
    dropShadow: { enabled: true }
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    labels: { show: false }
  },

  tooltip: {
    theme: 'dark',
    x: { show: false },
    y: { title: { formatter: () => '' } }
  }
})

watch(
  categories,
  (newCategories) => {
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: newCategories
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <ApexChart
    type="bar"
    height="380"
    :options="chartOptions"
    :series="series"
  />
</template>
