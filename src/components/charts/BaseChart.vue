<script setup>
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

defineProps({
  series: {
    type: Array,
    required: true
  }
})

const chartRef = ref(null)
const selection = ref('one_year')
// const series = ref([
//   {
//     data: [
//       [1327359600000, 30.95],
//       [1327446000000, 31.34],

//       [1336946400000, 32.23],
//       [1337032800000, 32.33],
//       [1337119200000, 32.36],
//       [1337205600000, 32.01],
//       [1339538400000, 31.79],
//       [1339624800000, 31.67],
//       [1339711200000, 32.39],
//       [1339970400000, 32.63],
//       [1340056800000, 32.89],
//       [1340143200000, 31.99],
//       [1340229600000, 31.23],
//       [1340316000000, 31.57],
//       [1340575200000, 30.84],
//       [1340661600000, 31.07],
//       [1340748000000, 31.41],
//       [1340834400000, 31.17],
//       [1340920800000, 32.37],
//       [1341180000000, 32.19],
//       [1341266400000, 32.51],
//       [1341439200000, 32.53],
//       [1341525600000, 31.37],
//       [1341784800000, 30.43],
//       [1341871200000, 30.44],
//       [1341957600000, 30.2],
//       [1342044000000, 30.14],
//       [1342130400000, 30.65],
//       [1342389600000, 30.4],
//       [1342476000000, 30.65],
//       [1342562400000, 31.43],
//       [1342648800000, 31.89],
//       [1342735200000, 31.38],
//       [1342994400000, 30.64],
//       [1343080800000, 30.02],
//       [1343167200000, 30.33],
//       [1343253600000, 30.95],
//       [1343340000000, 31.89],
//       [1343599200000, 31.01],
//       [1343685600000, 30.88],
//       [1343772000000, 30.69],
//       [1343858400000, 30.58],
//       [1346968800000, 32.46],
//       [1347228000000, 32.13],
//       [1347314400000, 32.43],
//       [1347400800000, 32.42],
//       [1347487200000, 32.81],
//       [1347573600000, 33.34],
//       [1347832800000, 33.41],
//       [1347919200000, 32.57],
//       [1348005600000, 33.12],
//       [1348092000000, 34.53],
//       [1348178400000, 33.83],
//       [1348437600000, 33.41],
//       [1348524000000, 32.9],
//       [1356562800000, 37.3],
//       [1356649200000, 36.9],
//       [1356908400000, 37.68],

//     ],
//   },
// ])

const chartOptions = ref({
  chart: {
    id: 'area-datetime',
    type: 'area',
    height: 300,
    zoom: { autoScaleYaxis: true },
  },
  annotations: {
    yaxis: [
      {
        y: 30,
        borderColor: '#999',
        label: {
          show: true,
          text: 'Date',
          style: { color: '#fff', background: '#00E396' },
        },
      },
    ],
    xaxis: [
      {
        x: new Date('14 Nov 2012').getTime(),
        borderColor: '#999',
        yAxisIndex: 0,
        label: {
          show: true,
          text: 'Purchases',
          style: { color: '#fff', background: '#775DD0' },
        },
      },
    ],
  },
  dataLabels: { enabled: false },
  markers: { size: 0, style: 'hollow' },
  xaxis: {
    type: 'datetime',
    min: new Date('01 Mar 2012').getTime(),
    tickAmount: 6,
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

function updateData(timeline) {
  selection.value = timeline
  let min, max
  switch (timeline) {
    case 'one_month':
      min = new Date('28 Jan 2013').getTime()
      max = new Date('27 Feb 2013').getTime()
      break
    case 'six_months':
      min = new Date('27 Sep 2012').getTime()
      max = new Date('27 Feb 2013').getTime()
      break
    case 'one_year':
      min = new Date('27 Feb 2012').getTime()
      max = new Date('27 Feb 2013').getTime()
      break
    case 'ytd':
      min = new Date('01 Jan 2013').getTime()
      max = new Date('27 Feb 2013').getTime()
      break
    case 'all':
      min = new Date('23 Jan 2012').getTime()
      max = new Date('27 Feb 2013').getTime()
      break
    default:
      return
  }
  // Use ApexCharts exec to zoom programmatically
  if (chartRef.value) {
    chartRef.value.zoomX(min, max)
  }
}
</script>

<template>
  <div>
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
