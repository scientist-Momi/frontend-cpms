<script setup>
import { ref, } from 'vue'
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'
import { useModalStore } from '@/stores/modalStore'
// import { useFunction } from '@/composables/useFunction'
import PageLoader from '../PageLoader.vue'
import { useToastStore } from '@/stores/toastStore'
import { useCustomer } from '@/composables/useCustomer'

// const { formatCurrency } = useFunction()
const { updateCustomer } = useCustomer()
const modal = useModalStore()
const toast = useToastStore()
const loading = ref(false)
const creditLimit = ref(modal.user.creditLimit)

const handleUpdate = async() => {
  loading.value = true
  const payload = {
    creditLimit: creditLimit.value,
  }
  const res = await updateCustomer(modal.user.customerId, payload)
  if(res.success){
    toast.showToast({ message: 'Update complete!', type: 'success' })
    modal.close()
    window.location.reload()
  }else {
    toast.showToast({ message: res.message || 'update failed.', type: 'error' })
  }
}
</script>

<template>
  <div class="bg-white h-full">
    <div v-if="loading">
      <PageLoader />
    </div>
    <div v-else class="p-6">
      <div class="mb-6">
        <div class="border border-gray-200 p-2 w-full">
          <small>Credit Limit</small>
          <input
            type="number"
            id="depositAmount"
            v-model="creditLimit"
            class="block mt-1 w-full text-gray-900 border-0 rounded-xs text-2xl focus:ring-gray-400 focus:outline-none"
          />
        </div>
        <p class="text-sm text-gray-400 mt-2">
          Enter new credit limit.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <PrimaryButton @click="handleUpdate">Update</PrimaryButton>
        <SecondaryButton @click="modal.close">Cancel</SecondaryButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
