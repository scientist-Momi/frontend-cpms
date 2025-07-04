<script setup>
defineProps({
  disabled: Boolean,
})
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    class="border border-gray-200 text-sm p-2 px-3 rounded-sm cursor-pointer font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot></slot>
  </button>
</template>


