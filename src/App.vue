<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import GlobalToast from './components/GlobalToast.vue'

const auth = useAuthStore()
auth.loadStoredAuth()
</script>

<template>
  <RouterView />
  <GlobalToast />
</template>
