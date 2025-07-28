<script setup>
import { ref, onMounted } from 'vue';
import PageLoader from '../PageLoader.vue';
import { useModalStore } from '@/stores/modalStore'
import { useProduct } from '@/composables/useProduct'

const { fetchVariants } = useProduct()
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

</script>

<template>
  <div class="bg-white h-full">
    <div v-if="loading">
      <PageLoader />
    </div>
    <div v-else class="p-6">
      <div class="flex flex-wrap gap-2">
        
        <template v-for="variant in productVariants" :key="variant.id">
          <div>
            <div v-if="editedId !== variant.id">
              <button
                class="px-3 py-2 rounded-full border border-gray-300 bg-blue-50 text-blue-700 font-medium shadow-sm hover:bg-blue-100 transition"
                @click="startEdit(variant)"
              >
                {{ variant.weight }}kg &middot; {{ variant.inventory }} in stock
              </button>
            </div>
            <div v-else class="flex items-center gap-1 bg-blue-50 border border-blue-300 p-2 rounded-full">
              <input
                v-model="editedWeight"
                type="number"
                min="0"
                class="w-20 text-center border border-gray-300 rounded px-2"
                placeholder="Weight"
              />
              <span>kg</span>
              <input
                v-model="editedInventory"
                type="number"
                min="0"
                class="w-20 text-center border border-gray-300 rounded px-2"
                placeholder="Inventory"
              />
              <button
                class="px-2 mx-1 rounded text-green-600 hover:bg-green-50"
                title="Save"
                @click="saveEdit(variant)"
              >✔</button>
              <button
                class="px-2 rounded text-gray-400 hover:bg-gray-100"
                title="Cancel"
                @click="cancelEdit"
              >✕</button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
