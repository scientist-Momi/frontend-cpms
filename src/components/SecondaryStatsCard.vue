<script setup>
import { defineProps } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String },
  period: { type: String, default: '' }
})
</script>

<template>
  <div class="bg-white rounded shadow border border-gray-200 p-5 w-full ">
    <div class="flex justify-between items-center mb-2">
      <span class="text-gray-700 font-medium text-sm">{{ label }}</span>
      <span class="material-symbols-outlined text-gray-400 text-base">{{ icon }}</span>
    </div>
    <div class="text-2xl font-medium text-gray-900">
    {{ value }}
    </div>
  </div>
</template>

