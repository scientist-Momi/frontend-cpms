<script setup>
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  series: { type: Array, required: true },
  categories: { type: Array, required: true },
  chartHeight: { type: Number, default: 250 },
})

const chartOptions = {
  chart: {
    height: '100%',
    maxWidth: '100%',
    type: 'area',
    fontFamily: 'Inter, sans-serif',
    dropShadow: { enabled: false },
    toolbar: { show: false },
  },
  tooltip: { enabled: true, x: { show: false } },
  legend: { show: false },
  fill: {
    type: 'gradient',
    gradient: { opacityFrom: 0.55, opacityTo: 0, shade: '#1C64F2', gradientToColors: ['#1C64F2'] }
  },
  dataLabels: { enabled: true },
  stroke: { width: 2 },
  grid: { show: false, strokeDashArray: 4, padding: { left: 2, right: 2, top: -26 } },
  xaxis: {
    categories: props.categories,
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    show: true,
    labels: { formatter: (value) => `$${value}` }
  }
}
</script>

<template>
  <div class="w-full border border-gray-200 bg-white rounded shadow p-4 md:p-6">
    <div class="flex justify-between mb-4">
      <div>
        <h5 class="leading-none text-3xl font-bold text-gray-900 pb-2">
          <slot name="summary-value">$0</slot>
        </h5>
        <p class="text-base font-normal text-gray-500">
          <slot name="summary-label">Summary</slot>
        </p>
      </div>
      <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 text-center">
        <slot name="trend-indicator">0%</slot>
        <svg
          class="w-3 h-3 ms-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13V1m0 0L1 5m4-4 4 4"
          />
        </svg>
      </div>
    </div>
    <VueApexCharts
      :options="chartOptions"
      :series="series"
      type="area"
      :height="chartHeight"
    />
    <div class="grid grid-cols-1 items-center border-gray-200 border-t justify-between mt-4">
      <div class="flex justify-between items-center pt-4">
        <button
          class="text-sm font-medium text-gray-500 hover:text-gray-900 text-center inline-flex items-center"
          type="button"
        >
          Last 7 days
          <svg
            class="w-2.5 m-2.5 ms-1.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        <a
          href="#"
          class="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 hover:bg-gray-100 px-3 py-2"
        >
          Report
          <svg
            class="w-2.5 h-2.5 ms-1.5 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
