<script setup>
import { ref, computed } from 'vue'

// Utility: Get all days for a month
function getMonthDays(year, month) {
  const days = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

// State
const show = ref(false)
const today = new Date()
const startMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const endMonth = ref(new Date(today.getFullYear(), today.getMonth() + 1, 1))
const range = ref([null, null])

// Computed: Days for each calendar
const daysLeft = computed(() => getMonthDays(startMonth.value.getFullYear(), startMonth.value.getMonth()))
const daysRight = computed(() => getMonthDays(endMonth.value.getFullYear(), endMonth.value.getMonth()))

// Format display
function formatRange([start, end]) {
  if (!start || !end) return ''
  const opts = { year: 'numeric', month: 'short', day: 'numeric' }
  return `${start.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', opts)}`
}

// Calendar navigation
function prevMonth() {
  startMonth.value = new Date(startMonth.value.getFullYear(), startMonth.value.getMonth() - 1, 1)
  endMonth.value = new Date(endMonth.value.getFullYear(), endMonth.value.getMonth() - 1, 1)
}
function nextMonth() {
  startMonth.value = new Date(startMonth.value.getFullYear(), startMonth.value.getMonth() + 1, 1)
  endMonth.value = new Date(endMonth.value.getFullYear(), endMonth.value.getMonth() + 1, 1)
}

// Date selection logic
function selectDate(date) {
  if (!range.value[0] || (range.value[0] && range.value[1])) {
    range.value = [date, null]
  } else if (date < range.value[0]) {
    range.value = [date, range.value[0]]
  } else {
    range.value[1] = date
  }
}

function isInRange(date) {
  if (!range.value[0] || !range.value[1]) return false
  return date > range.value[0] && date < range.value[1]
}
function isSelected(date) {
  return (
    (range.value[0] && date.toDateString() === range.value[0].toDateString()) ||
    (range.value[1] && date.toDateString() === range.value[1].toDateString())
  )
}

// Click outside to close
function onBlur(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) show.value = false
}
</script>

<template>
  <div class="relative w-full max-w-md" tabindex="0" @blur="onBlur">
    <!-- Input Bar -->
    <div
      class="flex items-center border rounded px-3 py-2 bg-white cursor-pointer w-full"
      @click="show = !show"
    >
      <span class="material-symbols-outlined text-gray-400 mr-2">calendar_month</span>
      <span class="text-sm text-gray-700 flex-1 truncate">
        {{ formatRange(range) || 'Select date range' }}
      </span>
      <span v-if="range[0] || range[1]" class="ml-2 text-gray-400 cursor-pointer" @click.stop="range = [null, null]">
        <span class="material-symbols-outlined text-base">close</span>
      </span>
    </div>

    <!-- Calendar Popup -->
    <div
      v-if="show"
      class="absolute z-20 mt-2 bg-white border rounded-xl shadow-lg flex p-4 gap-6"
      style="min-width: 480px"
    >
      <!-- Left Calendar -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <button @click="prevMonth" class="text-gray-400 hover:text-gray-700">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <span class="font-semibold text-gray-800">
            {{ startMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' }) }}
          </span>
          <span class="w-6"></span>
        </div>
        <div class="grid grid-cols-7 gap-1 text-xs text-gray-400 mb-1">
          <span v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d">{{ d }}</span>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <span v-for="n in new Date(daysLeft[0].getFullYear(), daysLeft[0].getMonth(), 1).getDay()" :key="'empty-l'+n"></span>
          <button
            v-for="date in daysLeft"
            :key="date.toDateString()"
            @click="selectDate(date)"
            :class="[
              'rounded p-1 w-8 h-8',
              isSelected(date) ? 'bg-rose-600 text-white font-bold' :
              isInRange(date) ? 'bg-rose-100 text-rose-700' :
              'hover:bg-gray-100 text-gray-800'
            ]"
          >
            {{ date.getDate() }}
          </button>
        </div>
      </div>
      <!-- Right Calendar -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="w-6"></span>
          <span class="font-semibold text-gray-800">
            {{ endMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' }) }}
          </span>
          <button @click="nextMonth" class="text-gray-400 hover:text-gray-700">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-xs text-gray-400 mb-1">
          <span v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d">{{ d }}</span>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <span v-for="n in new Date(daysRight[0].getFullYear(), daysRight[0].getMonth(), 1).getDay()" :key="'empty-r'+n"></span>
          <button
            v-for="date in daysRight"
            :key="date.toDateString()"
            @click="selectDate(date)"
            :class="[
              'rounded p-1 w-8 h-8',
              isSelected(date) ? 'bg-rose-600 text-white font-bold' :
              isInRange(date) ? 'bg-rose-100 text-rose-700' :
              'hover:bg-gray-100 text-gray-800'
            ]"
          >
            {{ date.getDate() }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
