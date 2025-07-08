<script setup>
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  series: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
  },
})

const chartRef = ref(null)
const selection = ref('one_month')

const chartOptions = ref({
  chart: {
    id: 'area-datetime',
    type: 'area',
    height: 300,
    zoom: { autoScaleYaxis: true },
  },
  dataLabels: { enabled: false },
  markers: { size: 0, style: 'hollow' },
  xaxis: {
    type: 'datetime',
    tickAmount: 6,
    labels: {
      datetimeUTC: false
    }
  },
  tooltip: { x: { format: 'dd MMM yyyy' } },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100],
    },
  },
})


function getMinMaxDates(series) {
  const allDates = series
    .flatMap((s) => s.data)
    .map((point) => point[0])
    .sort((a, b) => a - b)
  return {
    min: allDates[0],
    max: allDates[allDates.length - 1],
  }
}

function updateData(timeline) {
  selection.value = timeline
  const { min, max } = getMinMaxDates(
    Array.isArray(props.series) ? props.series : props.series.value,
  )
  let newMin, newMax
  const now = new Date(max)

  switch (timeline) {
    case 'one_month':
      newMin = new Date(now)
      newMin.setMonth(now.getMonth() - 1)
      newMin = newMin.getTime()
      newMax = now.getTime()
      break
    case 'six_months':
      newMin = new Date(now)
      newMin.setMonth(now.getMonth() - 6)
      newMin = newMin.getTime()
      newMax = now.getTime()
      break
    case 'one_year':
      newMin = new Date(now)
      newMin.setFullYear(now.getFullYear() - 1)
      newMin = newMin.getTime()
      newMax = now.getTime()
      break
    case 'ytd':
      newMin = new Date(now.getFullYear(), 0, 1).getTime()
      newMax = now.getTime()
      break
    case 'all':
      newMin = min
      newMax = max
      break
    default:
      return
  }

  if (chartRef.value) {
    chartRef.value.zoomX(newMin, newMax)
  }
}
</script>

<template>
  <div>
    <h1 class="py-2 font-medium">{{ title }}</h1>
    <div class="flex gap-2">
      <button
        v-for="option in [
          { label: '1M', value: 'one_month' },
          { label: '6M', value: 'six_months' },
          { label: '1Y', value: 'one_year' },
          { label: 'YTD', value: 'ytd' },
          { label: 'ALL', value: 'all' },
        ]"
        :key="option.value"
        :class="[
          'px-2 py-1 rounded border text-xs',
          selection === option.value ? 'bg-red-600 text-white' : 'bg-white text-gray-700',
        ]"
        @click="updateData(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <VueApexCharts
      ref="chartRef"
      type="area"
      height="300"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
