<script setup>
import { ref } from 'vue'
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'
import PageLoader from '../PageLoader.vue'
import { useProduct } from '@/composables/useProduct'
import { useToastStore } from '@/stores/toastStore'
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()
const toast = useToastStore()

const loading = ref(false)
const weight = ref('')
const inventory = ref('')
const {createVariant} = useProduct()

function resetForm() {
  weight.value = ''
  inventory.value = ''
}

const submitVariant = async() => {
  if (!weight.value || !inventory.value || isNaN(weight.value) || isNaN(inventory.value)) {
    toast.showToast({ message: 'All fields are required', type: 'error' })
    return
  }
  loading.value = true
  const payload = {
    weight: weight.value,
    inventory: inventory.value,
  }
  const res = await createVariant(modal.data, payload)
  if(res.success){
    toast.showToast({ message: 'Variant created!', type: 'success' })
    await new Promise((resolve) => setTimeout(resolve, 2500))
    modal.close()
    window.location.reload()
  }else {
    loading.value = false
    toast.showToast({ message: res.message || 'Creation failed.', type: 'error' })
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
          <small>Weight of Product (Kg)</small>
          <input
            type="number"
            id="weight"
            v-model="weight"
            placeholder="00.00"
            class="block mt-1 w-full text-gray-900 border-0 rounded-xs text-2xl focus:ring-gray-400 focus:outline-none"
          />
        </div>
        <p class="text-sm text-gray-400 mt-2">
          Enter the deposit amount OR adjust balance after deposit directly.
        </p>
      </div>
      <div class="mb-6">
        <div class="border border-gray-200 p-2 w-full">
          <small>Inventory of Variant</small>
          <input
            type="number"
            id="inventory"
            v-model="inventory"
            placeholder="0"
            class="block mt-1 w-full text-gray-900 border-0 rounded-xs text-2xl focus:ring-gray-400 focus:outline-none"
          />
        </div>
        <p class="text-sm text-gray-400 mt-2">
          Enter the deposit amount OR adjust balance after deposit directly.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <PrimaryButton @click="submitVariant">Add Variant</PrimaryButton>
        <SecondaryButton @click="resetForm">Reset</SecondaryButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
