<script setup>
import { ref, computed } from 'vue'
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'
import { useModalStore } from '@/stores/modalStore'
import { useFunction } from '@/composables/useFunction'
import PageLoader from '../PageLoader.vue'
import { useToastStore } from '@/stores/toastStore'
import { useProduct } from '@/composables/useProduct'
import { useRoute } from 'vue-router'

const route = useRoute()
const {  formatCurrency } = useFunction()
const { updatePrice } = useProduct()
const modal = useModalStore()
const toast = useToastStore()
const currentPrice = ref(modal.data)
const newPrice = ref('')
const loading = ref(false)
const productId = computed(() => route.params.id)

const handleUpdate = async() => {
  loading.value = true
  const payload = {
    price: newPrice.value,
  }
  const res = await updatePrice(productId.value, payload)
  await new Promise((resolve) => setTimeout(resolve, 2500))
  if(res.success){
    toast.showToast({ message: 'Update complete!', type: 'success' })
    modal.close()
    window.location.reload()
  }else {
    loading.value = false
    toast.showToast({ message: res.message || 'Update failed.', type: 'error' })
  }
}

</script>

<template>
  <div class="bg-white h-full">
    <div v-if="loading">
      <PageLoader />
    </div>
    <div v-else class="p-6">
      <div class="mb-6 ">
        <div class="border border-gray-200 p-2 w-full">
          <small>New Price</small>
          <input
            type="number"
            id="newPrice"
            v-model="newPrice"
            placeholder="0.00"
            class="block mt-1 w-full text-gray-900 border-0 rounded-xs text-2xl focus:ring-gray-400 focus:outline-none"
          />
        </div>
        <p class="text-sm text-gray-400 mt-2">
          Enter new unit price for product.
        </p>
      </div>
      <div class="mb-6 flex justify-between gap-2">
        <div class="border border-gray-200 p-2 w-full">
          <small>Current Price</small>
          <p class="text-2xl mt-1">{{ formatCurrency(currentPrice) }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <PrimaryButton @click="handleUpdate">Initiate Update</PrimaryButton>
        <SecondaryButton @click="modal.close">Cancel</SecondaryButton>
      </div>
    </div>
  </div>
</template>
