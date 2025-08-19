<script setup>
import { ref, onMounted } from 'vue'
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'
import PageLoader from '../PageLoader.vue'
import { useModalStore } from '@/stores/modalStore'
import { useToastStore } from '@/stores/toastStore'
import { useTransaction } from '@/composables/useTransaction'

const toast = useToastStore()
const { fetchTransaction } = useTransaction()
const loading = ref(false)
const modal = useModalStore()
const transaction = ref(null)

onMounted(async () => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const res = await fetchTransaction(modal.data)
  transaction.value = res.data
  loading.value = false
})
</script>

<template>
  <div class="bg-white h-full">
    <div v-if="loading">
      <PageLoader />
    </div>
    <div v-else class="p-6">
      <div v-if="transaction == null">
        <h1>No such transaction.</h1>
      </div>
      <div v-else>
        {{ transaction }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
