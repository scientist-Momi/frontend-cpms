<script setup>
import { ref, onMounted } from 'vue'
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'
import PageLoader from '../PageLoader.vue';
import { useModalStore } from '@/stores/modalStore'
import { useToastStore } from '@/stores/toastStore'

const toast = useToastStore()
</script>

<template>
  <div class="bg-white h-full">
    <div v-if="loading">
      <PageLoader />
    </div>
  </div>
</template>

<style scoped>
</style>
