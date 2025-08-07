<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toastStore'
import { useProductStore } from '@/stores/productStore'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import { useProduct } from '@/composables/useProduct'

const toast = useToastStore()
const product = useProductStore()
const router = useRouter()
const route = useRoute()

const { createProduct, updateProduct, fetchProductId, fetchProducts } = useProduct()

const isEditMode = ref(false)
const productId = ref(null)

// Form fields
const name = ref('')
const brand = ref('')
const inventory = ref('')
const price = ref('')
const description = ref('')

// function populateFields(data) {
//   name.value = data.name || ''
//   brand.value = data.brand || ''
//   inventory.value = String(data.inventory ?? '')
//   price.value = String(data.price ?? '')
//   description.value = data.description || ''
// }

onMounted(async () => {
  if (route.params.id) {
    isEditMode.value = true
    productId.value = route.params.id
    const res = await fetchProductId(productId.value)
    if (res?.data) populateFields(res.data)
  }
})

function populateFields(data) {
  if (isEditMode.value) {
    // In edit mode: retain full product name as free text
    name.value = data.name || ''
  } else {
    // In create mode: clear base field
    nameBase.value = ''
  }
  brand.value = data.brand || ''
  inventory.value = String(data.inventory ?? '')
  price.value = String(data.latestPrice?.price ?? data.price ?? '')
  description.value = data.description || ''
}

function validateForm() {
  if (!nameForSave.value || !brand.value || !price.value || !inventory.value || !description.value) {
    toast.showToast({ message: 'Please fill in all fields.', type: 'error' })
    return false
  }
  return true
}

async function handleSave() {
  if (!validateForm()) return

  const payload = {
    name: nameForSave.value,
    brand: brand.value,
    inventory: Number(inventory.value),
    price: Number(price.value),
    description: description.value,
  }

  let res
  if (isEditMode.value) {
    res = await updateProduct(productId.value, payload)
  } else {
    res = await createProduct(payload)
  }

  if (res.success) {
    await fetchProducts()
    toast.showToast({ message: 'Product saved successfully!', type: 'success' })
    router.push({ name: 'Products' })
  } else {
    toast.showToast({ message: res.message || 'Failed to save product.', type: 'error' })
  }
}

function clearForm() {
  name.value = ''
  brand.value = ''
  inventory.value = ''
  price.value = ''
  description.value = ''
}

const getTags = computed(() => {
  const brands = product.products.map((p) => p.brand)
  return [...new Set(brands)].filter(Boolean)
})

const tagOptions = computed(() => getTags.value)

const showOptions = ref(false)

const showOptionTags = () => {
  showOptions.value = true
}
const hideOptionTags = () => {
  showOptions.value = false
}

function setBrandFromTag(tag) {
  brand.value = tag
}

const nameBase = ref('')

const currentDate = new Date()
const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0') // 01-12
const currentYear = currentDate.getFullYear()

const nameForSave = computed(() => {
  return isEditMode.value
    ? name.value
    : nameBase.value
    ? `${nameBase.value.trim()} ${currentYear}-${currentMonth}`
    : ''
})
</script>

<template>
  <div class="mb-4 bg-white rounded">
    <div class="flex items-center p-4 border-b border-gray-200 gap-2">
      <span class="material-symbols-outlined"> inventory_2 </span>
      <p class="font-semibold">
        {{ isEditMode ? 'Edit Product' : 'New Product' }}
      </p>
    </div>
    <div class="p-4 space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block mb-1 text-sm font-medium text-gray-900">
            Product Name
          </label>
          <div v-if="isEditMode">
    <input
      id="name"
      type="text"
      v-model="name"
      placeholder="Enter product name"
      class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:outline-none focus:ring-gray-400"
    />
  </div>
  <div v-else class="relative">
    <input
      id="nameBase"
      type="text"
      v-model="nameBase"
      placeholder="Enter base name"
      class="block w-full pr-24 text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:outline-none focus:ring-gray-400"
    />
    <span
      class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none"
    >
      {{ currentYear }}-{{ currentMonth }}
    </span>
  </div>
        </div>
        <div>
          <label for="brand" class="block mb-1 text-sm font-medium text-gray-900">Brand</label>
          <input
            @focus="showOptionTags"
            @blur="hideOptionTags"
            id="brand"
            type="text"
            v-model="brand"
            class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:outline-none focus:ring-gray-400"
          />
          <div v-if="showOptions" class="flex mt-2 gap-1.5">
            <span
              v-for="tag in tagOptions"
              :key="tag"
              class="px-2 py-1 border border-gray-200 rounded text-sm cursor-pointer hover:bg-gray-100"
              @mousedown.prevent="setBrandFromTag(tag)"
              >{{ tag }}</span
            >
          </div>
        </div>
        <div>
          <label for="inventory" class="block mb-1 text-sm font-medium text-gray-900"
            >Inventory</label
          >
          <input
            id="inventory"
            type="number"
            v-model="inventory"
            class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:outline-none focus:ring-gray-400"
          />
        </div>
        <div>
          <label for="price" class="block mb-1 text-sm font-medium text-gray-900"
            >Unit Price (Price Per 1kg)</label
          >
          <input
            id="price"
            type="number"
            v-model="price"
            class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:outline-none focus:ring-gray-400"
          />
        </div>
      </div>

      <div>
        <label for="description" class="block mb-1 text-sm font-medium text-gray-900"
          >Description</label
        >
        <textarea
          id="description"
          rows="4"
          v-model="description"
          class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:outline-none focus:ring-gray-400"
          placeholder="Product description..."
        ></textarea>
      </div>

      <div class="flex items-center gap-2">
        <PrimaryButton @click="handleSave">
          {{ isEditMode ? 'Update Product' : 'Create Product' }}
        </PrimaryButton>
        <SecondaryButton type="button" @click="clearForm">Clear Form</SecondaryButton>
      </div>
    </div>
  </div>
</template>
