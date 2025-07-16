<script setup>
import { computed } from 'vue'

const props = defineProps({
  available: { type: Number, required: true },
  total: { type: Number, required: true },
  size: { type: Number, default: 100 },     // diameter in px
  stroke: { type: Number, default: 10 },    // thickness of circle
  color: { type: String, default: '#41B883' } // progress color
})

// Calculate
const percent = computed(() =>
  props.total > 0 ? (props.available / props.total) * 100 : 0
)
const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() =>
  circumference.value - (percent.value / 100) * circumference.value
)
</script>

<template>
  <div :style="{ width: size + 'px', height: size + 'px' }" class="relative flex items-center justify-center">
    <svg
      :width="size"
      :height="size"
      class="transform -rotate-90"
    >
      <!-- Background Circle -->
      <circle
        :r="radius"
        :cx="size / 2"
        :cy="size / 2"
        :stroke-width="stroke"
        class="text-gray-200"
        fill="transparent"
        stroke="currentColor"
      />
      <!-- Progress Circle -->
      <circle
        :r="radius"
        :cx="size / 2"
        :cy="size / 2"
        :stroke-width="stroke"
        fill="transparent"
        :stroke="color"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        stroke-linecap="round"
        style="transition: stroke-dashoffset 0.5s;"
      />
    </svg>
    <!-- Centered Inventory Value -->
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-3xl font-semibold text-gray-900" style="line-height: 1;">
        {{ available }}
      </span>
      <span class="text-sm text-gray-500 font-medium" style="line-height: 1;">
        /{{ total }}
      </span>
    </div>
  </div>
</template>
