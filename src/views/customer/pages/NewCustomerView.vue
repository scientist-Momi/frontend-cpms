<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import { useToastStore } from '@/stores/toastStore'
import { useCustomer } from '@/composables/useCustomer'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()

const toast = useToastStore()
const { createCustomer, fetchCustomers, fetchCustomerId, updateCustomer } = useCustomer()

const isEditMode = ref(false);
const customerId = ref(null);
const email = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const alias = ref('')
const address = ref('')
const customerNotes = ref('New Customer...')
const customerType = ref('')


const populateField = (data) => {
  email.value = data.email || ''
  phone.value = data.phone || ''
  alias.value = data.alias || ''
  address.value = data.address || ''
  customerNotes.value = data.customerNotes || ''
  customerType.value = data.customerType || ''
  if (data.name) {
    const nameParts = data.name.trim().split(' ')
    firstName.value = nameParts[0] || ''
    lastName.value = nameParts.slice(1).join(' ') || ''
  } else {
    firstName.value = ''
    lastName.value = ''
  }
}

onMounted(async () => {
  if (route.params.id) {
    isEditMode.value = true
    customerId.value = route.params.id
    const res = await fetchCustomerId(customerId.value)
    populateField(res.data)
  }
})


function validateForm() {
  if (
    !email.value ||
    !firstName.value ||
    !lastName.value ||
    !phone.value ||
    !address.value ||
    !customerType.value
  ) {
    toast.showToast({
      message: 'All fields are required.',
      type: 'error',
    })
    return false
  }
  return true
}

const handleSave = async () => {
  validateForm()

  const payload = {
    name: firstName.value + ' ' + lastName.value,
    email: email.value,
    phone: phone.value,
    alias: alias.value,
    address: address.value,
    customerNotes: customerNotes.value,
    customerType: customerType.value,
  }

  // const res = await createCustomer(payload)
  let res;
  if (isEditMode.value) {
    res = await updateCustomer(customerId.value, payload);
  } else {
    res = await createCustomer(payload);
  }
  if (res.success) {
    await fetchCustomers()
    toast.showToast({
      message: 'Operation was successfull!',
      type: 'success',
    })
    router.push({ name: 'Customers' })
  } else {
    toast.showToast({
      message: res.message || 'Operation failed.',
      type: 'error',
    })
  }
}

function clearForm() {
  email.value = ''
  firstName.value = ''
  lastName.value = ''
  phone.value = ''
  alias.value = ''
  address.value = ''
  customerNotes.value = ''
  customerType.value = ''
}
</script>

<template>
  <div class="mb-4 bg-white rounded">
    <div class="flex items-center p-4 border-b border-gray-200 gap-2">
      <span class="material-symbols-outlined"> group </span>
      <p class="font-semibold">New Customer Form</p>
    </div>
    <div class="p-4">
      <div class="mb-6 flex items-center gap-2">
        <div class="w-full">
          <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            v-model="firstName"
            class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
          />
        </div>
        <div class="w-full">
          <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            v-model="lastName"
            class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
          />
        </div>
      </div>
      <div class="mb-6 flex gap-2">
        <div class="w-full">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900"> Email </label>
          <input
            type="text"
            id="email"
            v-model="email"
            class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
          />
          <!-- <p class="text-sm text-gray-400 mt-2">Email will be verified in the next step.</p> -->
        </div>
        <div class="w-full">
          <label for="phone" class="block mb-2 text-sm font-medium text-gray-900"> Phone </label>
          <input
            type="text"
            id="phone"
            v-model="phone"
            class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
          />
        </div>
        <div class="w-full">
          <label for="alias" class="block mb-2 text-sm font-medium text-gray-900"> Alias </label>
          <input
            type="text"
            id="alias"
            v-model="alias"
            class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
          />
          <p class="text-sm text-gray-400 mt-2">Other names the customer is known as.</p>
        </div>
      </div>
      <div class="mb-6 ">
        <!--  -->
        <h3 class="block mb-2 text-sm font-medium text-gray-900">Choose Customer Type:</h3>
        <ul class="flex gap-2">
          <li class="w-full">
            <input
              type="radio"
              id="consumer"
              name="customerType"
              value="CONSUMER"
              class="hidden peer"
              v-model="customerType"
              required
            />
            <label
              for="consumer"
              class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded cursor-pointer peer-checked:border-red-600 peer-checked:text-gray-600 hover:text-gray-600 hover:bg-gray-50"
            >
              <div class="block">
                <div class="rounded-md text-blue-600 p-1.5 mb-2 flex items-center shadow bg-blue-200 w-fit">
                  <span class="material-symbols-outlined"> local_mall </span>
                </div>
                <div class="w-full text-lg font-semibold">Consumer</div>
                <div class="w-full text-sm">A JavaScript library for building user interfaces.</div>
              </div>
            </label>
          </li>
          <li class="w-full">
            <input type="radio" id="retailer" name="customerType" value="RETAILER" class="hidden peer" v-model="customerType" />
            <label
              for="retailer"
              class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded cursor-pointer peer-checked:border-red-600 peer-checked:text-gray-600 hover:text-gray-600 hover:bg-gray-50"
            >
              <div class="block">
                <div class="rounded-md text-orange-600 p-1.5 flex items-center shadow bg-orange-200 w-fit mb-2">
                  <span class="material-symbols-outlined"> trolley </span>
                </div>
                <div class="w-full text-lg font-semibold">Retailer</div>
                <div class="w-full text-sm">
                  Vue.js is a model–view front end JavaScript framework.
                </div>
              </div>
            </label>
          </li>
          <li class="w-full">
            <input
              type="radio"
              id="wholesaler"
              name="customerType"
              value="WHOLESALER"
              class="hidden peer"
              v-model="customerType"
            />
            <label
              for="wholesaler"
              class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded cursor-pointer peer-checked:border-red-600 peer-checked:text-gray-600 hover:text-gray-600 hover:bg-gray-50"
            >
              <div class="block">
                <div class="rounded-md text-purple-600 p-1.5 flex items-center shadow bg-purple-200 w-fit mb-2">
                  <span class="material-symbols-outlined"> delivery_truck_speed </span>
                </div>
                <div class="w-full text-lg font-semibold">Wholesaler</div>
                <div class="w-full text-sm">A TypeScript-based web application framework.</div>
              </div>
            </label>
          </li>
        </ul>

        <!-- <label for="customerType" class="block mb-2 text-sm font-medium text-gray-900">
            Customer Type
          </label>
          <select
            id="customerType"
            v-model="customerType"
            class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
          >
            <option selected>Choose a type</option>
            <option value="CONSUMER">CONSUMER</option>
            <option value="RETAILER">RETAILER</option>
            <option value="WHOLESALER">WHOLESALER</option>
          </select> -->
      </div>

      <div class="mb-6 flex gap-2">
        <div class="w-full">
          <label for="address" class="block mb-2 text-sm font-medium text-gray-900">
            Address
          </label>
          <textarea
            id="address"
            rows="4"
            v-model="address"
            class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
            placeholder="Customer address here..."
          ></textarea>
        </div>
        <div class="w-full">
          <label for="customerNotes" class="block mb-2 text-sm font-medium text-gray-900">
            Customer Notes
          </label>
          <textarea
            id="customerNotes"
            rows="4"
            v-model="customerNotes"
            class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
            placeholder="Any valid information about customer here..."
          ></textarea>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <PrimaryButton @click="handleSave" class="flex items-center gap-1">
          Submit
          <span class="material-symbols-outlined icon1"> arrow_right_alt </span>
        </PrimaryButton>
        <SecondaryButton type="button" @click="clearForm">Clear form</SecondaryButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
