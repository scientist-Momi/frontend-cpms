<script setup>
import { ref, onMounted } from 'vue'
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'
import PageLoader from '../PageLoader.vue'
import { useModalStore } from '@/stores/modalStore'
import { useProduct } from '@/composables/useProduct'
import { useToastStore } from '@/stores/toastStore'
const toast = useToastStore()

const { fetchVariants, updateVariant } = useProduct()
const loading = ref(false)
const modal = useModalStore()
const productVariants = ref([])
const editedId = ref(null)
const editedWeight = ref('')
const editedInventory = ref('')

onMounted(async () => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const res3 = await fetchVariants(modal.data)
  productVariants.value = res3.data
  loading.value = false
})

function startEdit(variant) {
  editedId.value = variant.id
  editedWeight.value = variant.weight
  editedInventory.value = variant.inventory
}

function cancelEdit() {
  editedId.value = null
  editedWeight.value = ''
  editedInventory.value = ''
}

const handleSave = async () => {
  if (
    !editedWeight.value ||
    !editedInventory.value ||
    isNaN(editedWeight.value) ||
    isNaN(editedInventory.value)
  ) {
    toast.showToast({ message: 'All fields are required and must be numbers', type: 'error' })
    return
  }
  loading.value = true
  const payload = {
    weight: editedWeight.value,
    inventory: editedInventory.value,
  }
  const res = await updateVariant(modal.data, editedId.value, payload)
  if (res.success) {
    toast.showToast({ message: 'Variant updated!', type: 'success' })
    await new Promise((resolve) => setTimeout(resolve, 2500))
    modal.close()
    window.location.reload()
  } else {
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
      <div v-if="productVariants = []">
        <h1>No variants to update.</h1>
      </div>
      <div v-else>
        <small>Click on variant you want to update or delete.</small>
        <div class="flex flex-wrap gap-2 rounded border border-gray-200 p-2">
          <div
            @click="startEdit(variant)"
            class="border border-gray-200 p-2 py-1 hover:bg-gray-200 cursor-pointer rounded"
            v-for="variant in productVariants"
            :key="variant.id"
          >
            {{ variant.weight }}kg
          </div>
        </div>
        <div class="mt-4">
          <div class="mb-6">
            <div class="border border-gray-200 p-2 w-full">
              <small>Weight of Product (Kg)</small>
              <input
                type="number"
                id="weight"
                v-model="editedWeight"
                placeholder="00.00"
                class="block mt-1 w-full text-gray-900 border-0 rounded-xs text-2xl focus:ring-gray-400 focus:outline-none"
              />
            </div>
            <p class="text-sm text-gray-400 mt-2">
              Enter the weight of the product to be recorded.
            </p>
          </div>
          <div class="mb-6">
            <div class="border border-gray-200 p-2 w-full">
              <small>Inventory of Variant</small>
              <input
                type="number"
                id="inventory"
                v-model="editedInventory"
                placeholder="0"
                class="block mt-1 w-full text-gray-900 border-0 rounded-xs text-2xl focus:ring-gray-400 focus:outline-none"
              />
            </div>
            <p class="text-sm text-gray-400 mt-2">
              Enter the number of products with the weight listed.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <PrimaryButton @click="handleSave">Save Variant</PrimaryButton>
            <PrimaryButton @click="handleSave">Delete Variant</PrimaryButton>
            <SecondaryButton @click="cancelEdit">Cancel</SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
