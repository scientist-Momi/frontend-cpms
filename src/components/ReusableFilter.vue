<script setup>
import { ref } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  label: { type: String, required: true },
  options: { type: Array, required: true },
  modelValue: { required: true },
  icon: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue'])
const open = ref(false)

function selectOption(val) {
  emit('update:modelValue', val)
  open.value = false
}
</script>

<template>
  <div class="relative shadow-md">
    <button
      class="border border-gray-200 rounded px-5 py-1.5 text-base bg-white hover:bg-gray-50 flex items-center gap-2 font-medium cursor-pointer"
      @click="open = !open"
      type="button"
    >
      <span class="material-symbols-outlined text-white bg-gray-600 rounded p-0.5">{{icon}}</span>
      <!-- <span class="material-symbols-outlined"> arming_countdown </span> -->
      {{ label }}
    </button>
    <div
      v-if="open"
      class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow z-11"
    >
      <div v-for="option in options" :key="option.value">
        <button
          class="flex items-center w-full px-4 py-2 gap-2 hover:bg-gray-100 text-sm"
          :class="modelValue === option.value ? 'bg-gray-200' : ''"
          @click="selectOption(option.value)"
        >
          <span v-if="option.icon" :class="['material-symbols-outlined', option.iconClass || '']">{{
            option.icon
          }}</span>
          {{ option.label }} ({{ option.count }})
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-size: 14px;
}
</style>
