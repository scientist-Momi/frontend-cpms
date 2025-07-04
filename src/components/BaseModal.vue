<!-- components/BaseModal.vue -->
<script setup>
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()
</script>

<template>
  <div v-if="modal.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

    <div class="bg-white rounded shadow-lg w-full max-w-md">
      <div class="border-b border-gray-200 px-3 py-2 text-md font-semibold">
        <slot name="header" ></slot>
      </div>
      <div class="p-4">
        <slot ></slot>
      </div>

    </div>
  </div>
</template>

