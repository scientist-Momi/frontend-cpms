<script setup>
import { useUIStore } from '@/stores/uiStore'
const ui = useUIStore()
</script>

<template>
  <div v-if="!ui.sidebarCollapsed" class="flex justify-between mb-5 items-center py-2 rounded">
    <button
      type="button"
      class="flex gap-2 items-center w-full justify-center py-2 rounded bg-white hover:bg-gray-100 transition cursor-not-allowed"
      disabled
      title="AI Agent (Coming Soon)"
    >
      <span class="material-symbols-outlined cmd text-yellow-400"> stars_2 </span>
      <span class="font-medium whitespace-nowrap text-[0.9rem] transition-opacity duration-200"
        >AI Agent</span
      >
      <span
        class="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded border-[0.5px] border-gray-400 cmd1"
        >Coming soon</span
      >
    </button>
  </div>
</template>

<style scoped>
.cmd {
  font-size: 18px;
}

.cmd1 {
  font-size: 10px;
}
</style>
