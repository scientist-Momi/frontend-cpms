<script setup>
defineProps({
  disabled: Boolean,
})
</script>

<template>
<button
  :disabled="disabled"
  class="bg-red-600 text-white text-sm p-2 px-3 rounded-sm cursor-pointer font-medium hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
>
  <slot></slot>
</button>

</template>
