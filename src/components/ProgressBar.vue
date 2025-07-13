<script setup>
import { computed } from 'vue'

const props = defineProps({
  available: { type: Number, required: true },
  total: { type: Number, required: true }
})

const percent = computed(() =>
  props.total > 0
    ? Math.round((props.available / props.total) * 100)
    : 0
)
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <div class="relative w-full bg-gray-200 rounded h-5 overflow-hidden">
      <!-- Progress bar -->
      <div
        class="bg-green-500 h-5 rounded transition-all duration-300 flex items-center justify-center"
        :style="{ width: percent + '%' }"
      >
        <small class="text-xs font-semibold text-white w-full text-center">
          {{ available }}/{{ total }}
        </small>
      </div>
    </div>
  </div>
</template>
