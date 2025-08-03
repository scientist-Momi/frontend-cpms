<script setup>
import { useModalStore } from '@/stores/modalStore'
import PageLoader from './PageLoader.vue';

const modal = useModalStore()
</script>

<template>
  <div v-if="modal.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

    <div class="bg-white rounded shadow-lg w-full max-w-md">
      <page-loader></page-loader>

    </div>
  </div>
</template>
