<script setup>
import { useUIStore } from '@/stores/uiStore'
const ui = useUIStore()
</script>

<template>
    <div v-if="!ui.sidebarCollapsed" class="flex justify-between mb-5 items-center bg-gray-200 px-3 py-2 rounded">
      <div class="flex gap-3">
        <span class="material-symbols-outlined text-gray-400"> search </span>
        <input
          type="text"
          placeholder="Search anything"
          class="border-o focus:outline-none focus:ring-0 text-sm font-medium"
        />
      </div>

      <div class="flex items-center">
        <span class="material-symbols-outlined cmd text-gray-400"> keyboard_command_key </span>
        <p class="text-gray-400">K</p>
      </div>
    </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-size: 24px;
}

.cmd {
  font-size: 18px;
}
</style>
