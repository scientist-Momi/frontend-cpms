<script setup>
import { ref, computed, watch } from 'vue'

// ======== MOCK DATA AND API =========
// Replace with actual API calls in production!
const allCustomers = [
  { id: 'customer-1', name: 'Alice James' },
  { id: 'customer-2', name: 'Ben Peters' },
  { id: '9ede1659-57f0-4194-aae6-2955f7ea977a', name: 'Fanupé Johnson' }
]

const allProducts = [
  { id: 1, name: 'Rice', latestPrice: { price: 2600 } },
  { id: 2, name: 'Beans', latestPrice: { price: 3200 } },
  { id: 7, name: 'Spaghetti', latestPrice: { price: 1600 } }
]
// productId -> array of variants
const allVariants = {
  1: [
    { id: 4, name: 'Rice 5kg', weight: 5 },
    { id: 5, name: 'Rice 10kg', weight: 10 }
  ],
  2: [
    { id: 6, name: 'Beans 2kg', weight: 2 }
  ],
  7: [
    { id: 7, name: 'Spaghetti 1kg', weight: 1 }
  ]
}

async function fetchProducts() { return allProducts }
async function fetchVariants(productId) { return allVariants[productId] || [] }
async function fetchCustomers() { return allCustomers }
async function fetchProductById(productId) { return allProducts.find(p => p.id === productId) }

function formatCurrency(val) {
  if (val == null) return '₦0';
  return '₦' + Number(val).toLocaleString();
}
// ========== END MOCK DATA ===========

// ========== COMPONENT STATE =========
const customerId = ref('')
const customers = ref([])
const productOptions = ref([])
const rows = ref([
  // Row structure: { productId, variantId, quantity, unitPrice, unitPriceDisplay, variantWeight, lineDiscount, variants }
  { productId: null, variantId: null, quantity: 1, unitPrice: null, unitPriceDisplay: null, variantWeight: null, lineDiscount: 0, variants: [] }
])

// ========= FETCH DATA ON MOUNT ======
;(async function init() {
  customers.value = await fetchCustomers()
  productOptions.value = await fetchProducts()
})()

// ============= METHODS ==============
function addRow() {
  rows.value.push({ productId: null, variantId: null, quantity: 1, unitPrice: null, unitPriceDisplay: null, variantWeight: null, lineDiscount: 0, variants: [] })
}

function removeRow(idx) {
  if (rows.value.length > 1) rows.value.splice(idx, 1)
}

// Handles when product is selected in a row
async function onProductSelect(row) {
  if (!row.productId) {
    row.variants = []
    row.variantId = null
    row.unitPrice = null
    row.variantWeight = null
    return
  }
  // Fetch and set variants list
  row.variants = await fetchVariants(row.productId)
  // Fetch unit price
  const product = await fetchProductById(row.productId)
  row.unitPriceDisplay = product?.latestPrice?.price ?? 0
  row.unitPrice = row.unitPriceDisplay
  // Reset variant, quantity, discount
  row.variantId = null
  row.variantWeight = null
  row.quantity = 1
  row.lineDiscount = 0
}

// Handles when variant is selected in a row
function onVariantSelect(row) {
  const v = row.variants.find(v => v.id === row.variantId)
  row.variantWeight = v ? v.weight : null
}

// Calculates total for a row: weight × unit price × quantity − line discount
function rowTotal(row) {
  const w = +row.variantWeight || 0
  const p = +row.unitPrice || 0
  const q = +row.quantity || 0
  const d = +row.lineDiscount || 0
  return (w * p * q) - d
}

// Computes overall grand total (sum of line totals)
const grandTotal = computed(() => rows.value.reduce((sum, row) => sum + rowTotal(row), 0))

// =========== SUBMISSION ============
function onSubmit() {
  // Basic validation: a customer is selected and all rows filled
  if (!customerId.value) {
    alert('Choose a customer')
    return
  }
  for (const row of rows.value) {
    if (!row.productId || !row.variantId || !row.quantity || !row.unitPrice) {
      alert('Fill all fields in each row')
      return
    }
  }

  // Prepare payload
  const payload = {
    customerId: customerId.value,
    transactionDetails: rows.value.map(row => ({
      productId: row.productId,
      variantId: row.variantId,
      quantity: +row.quantity,
      unitPrice: +row.unitPrice,
      lineDiscount: +row.lineDiscount
    }))
  }
  alert(JSON.stringify(payload, null, 2))
  // Send payload to backend (not shown here)
}
</script>

<template>
  <div class="max-w-3xl my-6 mx-auto bg-white rounded-lg shadow-md p-8">
    <h2 class="text-2xl font-bold mb-4">New Transaction</h2>

    <!-- Customer select -->
    <div class="mb-6">
      <label class="block mb-2 font-semibold">Customer</label>
      <select v-model="customerId" class="p-2 border rounded min-w-[300px]">
        <option disabled value="">Choose customer...</option>
        <option v-for="cust in customers" :key="cust.id" :value="cust.id">{{ cust.name }}</option>
      </select>
    </div>

    <!-- Transaction rows -->
    <table class="w-full mb-4 border-t border-b">
      <thead>
        <tr>
          <th class="p-2">Product</th>
          <th class="p-2">Variant</th>
          <th class="p-2">Unit Price</th>
          <th class="p-2">Weight</th>
          <th class="p-2">Quantity</th>
          <th class="p-2">Discount</th>
          <th class="p-2">Total</th>
          <th class="p-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in rows" :key="idx" class="odd:bg-gray-50">
          <!-- Product dropdown -->
          <td>
            <select v-model="row.productId" @change="onProductSelect(row)" class="p-1 border rounded min-w-[120px]">
              <option disabled value="">Pick product…</option>
              <option v-for="p in productOptions" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </td>
          <!-- Variant dropdown -->
          <td>
            <select v-model="row.variantId" @change="onVariantSelect(row)" class="p-1 border rounded min-w-[120px]" :disabled="!row.variants.length">
              <option disabled value="">Pick variant…</option>
              <option v-for="v in row.variants" :key="v.id" :value="v.id">{{ v.name }} ({{ v.weight }}kg)</option>
            </select>
          </td>
          <!-- Unit price (readonly) -->
          <td>
            <span class="inline-block w-16 text-right">{{ formatCurrency(row.unitPriceDisplay) }}</span>
          </td>
          <!-- Weight (readonly) -->
          <td>
            <span class="inline-block w-10 text-right">{{ row.variantWeight ?? "—" }}</span>
          </td>
          <!-- Quantity -->
          <td>
            <input type="number" v-model.number="row.quantity" min="1" class="p-1 border rounded w-16" />
          </td>
          <!-- Discount -->
          <td>
            <input type="number" v-model.number="row.lineDiscount" min="0" class="p-1 border rounded w-16" />
          </td>
          <!-- Row total -->
          <td>
            <span class="font-semibold">{{ formatCurrency(rowTotal(row)) }}</span>
          </td>
          <!-- Remove -->
          <td>
            <button type="button" @click="removeRow(idx)" :disabled="rows.length===1" class="text-red-500">x</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button type="button" class="mb-4 px-3 py-1 bg-blue-600 text-white rounded shadow" @click="addRow">
      + Add Product
    </button>

    <!-- Total summary -->
    <div class="text-right text-lg font-medium">
      Grand Total: <span class="font-bold">{{ formatCurrency(grandTotal) }}</span>
    </div>

    <!-- Submit -->
    <div class="mt-8 text-right">
      <button @click="onSubmit" class="px-6 py-2 bg-green-600 text-white font-semibold rounded shadow hover:bg-green-700">
        Submit Transaction
      </button>
    </div>
  </div>
</template>

<style scoped>
/* You can add more styles or use Tailwind as above */
</style>
