<script setup>
import { ref, watch } from 'vue'
import PrimaryButton from '../buttons/PrimaryButton.vue'
import SecondaryButton from '../buttons/SecondaryButton.vue'
import { useModalStore } from '@/stores/modalStore'
import { useFunction } from '@/composables/useFunction'
import PageLoader from '../PageLoader.vue'
import { useToastStore } from '@/stores/toastStore'
import { useCustomer } from '@/composables/useCustomer'

const {  formatCurrency } = useFunction()
const { newDeposit} = useCustomer()
const amount = ref('')
const description = ref('')
const modal = useModalStore()
const toast = useToastStore()
const note = ref('')

const currentBalance = ref(modal.data)
const customerId = ref(modal.user.customerId)
const balanceAfterDeposit = ref('')
const showOptions = ref(false)
const loading = ref(false)

watch(amount, (newVal) => {
  const amt = parseFloat(newVal)
  if (!isNaN(amt)) {
    balanceAfterDeposit.value = currentBalance.value + amt
  } else {
    balanceAfterDeposit.value = ''
  }
})

watch(balanceAfterDeposit, (newVal) => {
  const bal = parseFloat(newVal)
  if (!isNaN(bal)) {
    amount.value = bal - currentBalance.value
  } else {
    amount.value = ''
  }
})

const submitDeposit = async() => {
  loading.value = true
  const payload = {
    customerId: customerId.value,
    amount: amount.value,
    note: note.value
  }
  const res = await newDeposit(payload)
  if(res.success){
    toast.showToast({ message: 'Deposit complete!', type: 'success' })
    modal.close()
    window.location.reload()
  }else {
    toast.showToast({ message: res.message || 'Deposit failed.', type: 'error' })
  }
}

function resetForm() {
  amount.value = ''
  description.value = ''
  balanceAfterDeposit.value = ''
}

const tagOptions = [
  'Paying off debts',
  'Deposit for incoming products'
]

const showOptionTags = () => {
  showOptions.value = true
}
const hideOptionTags = () => {
  showOptions.value = false
}

function setNoteFromTag(tag) {
  note.value = tag
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
          <small>Deposit Amount</small>
          <input
            type="number"
            id="depositAmount"
            v-model="amount"
            placeholder="0.00"
            class="block mt-1 w-full text-gray-900 border-0 rounded-xs text-2xl focus:ring-gray-400 focus:outline-none"
          />
        </div>
        <p class="text-sm text-gray-400 mt-2">
          Enter the deposit amount OR adjust balance after deposit directly.
        </p>
      </div>

      <div class="mb-6 flex justify-between gap-2">
        <div class="border border-gray-200 p-2 w-full">
          <small>Current Balance</small>
          <p class="text-2xl mt-1">{{ formatCurrency(currentBalance) }}</p>
        </div>

        <div class="border border-gray-200 p-2 w-full">
          <small>Balance After Deposit</small>
          <input
            type="number"
            id="balanceAfterDeposit"
            v-model="balanceAfterDeposit"
            :placeholder="formatCurrency(currentBalance)"
            class="block mt-1 w-full text-gray-900 border-0 rounded-xs text-2xl focus:ring-gray-400 focus:outline-none"
          />
        </div>
      </div>
      <div class="mb-6">
        <label for="note" class="block mb-2 text-sm font-medium text-gray-900">
          Enter deposit description
        </label>
        <textarea
          @focus="showOptionTags"
          @blur="hideOptionTags"
          id="note"
          rows="2"
          v-model="note"
          class="block w-full text-gray-900 border border-gray-300 rounded-xs p-2 px-3 text-sm focus:ring-gray-400 focus:outline-none"
          placeholder="Information about deposit..."
        ></textarea>
        <div v-if="showOptions" class="flex mt-2 gap-1.5">
          <span
            v-for="tag in tagOptions"
            :key="tag"
            class="px-2 py-1 border border-gray-200 rounded text-sm cursor-pointer hover:bg-gray-100"
            @mousedown.prevent="setNoteFromTag(tag)"
          >{{ tag }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <PrimaryButton @click="submitDeposit">Initiate Deposit</PrimaryButton>
        <SecondaryButton @click="resetForm">Reset form</SecondaryButton>
      </div>
    </div>
  </div>
</template>
