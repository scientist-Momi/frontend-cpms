<script setup>
import { ref, computed} from 'vue'
import {  TransitionRoot } from '@headlessui/vue'
import { onClickOutside } from '@vueuse/core'
import { PERMISSION_GROUPS } from '@/constants/permissions.js'


const props = defineProps({
  modelValue: Array,
})

const allPermissions = computed(() =>
  PERMISSION_GROUPS.flatMap(g =>
    g.permissions.map(permission => permission.key)
  )
)

const emit = defineEmits(['update:modelValue'])

const selected = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const dropdownOpen = ref(false)
const wrapperRef = ref()

const togglePermission = (permission) => {
  if (!selected.value.includes(permission)) {
    selected.value = [...selected.value, permission]
  }
}

const removePermission = (permission) => {
  selected.value = selected.value.filter(p => p !== permission)
}

onClickOutside(wrapperRef, () => {
  dropdownOpen.value = false
})
</script>

<template>
  <div ref="wrapperRef" class="relative w-full">
    <!-- Selection Box -->
    <div
      @click="dropdownOpen = !dropdownOpen"
      class="min-h-[60px] w-full p-2 border border-gray-300 rounded bg-white shadow-sm flex flex-wrap items-center gap-2 cursor-pointer focus-within:ring-2 ring-blue-300"
    >
      <template v-if="selected.length">
        <span
          v-for="(permission, index) in selected"
          :key="index"
          class="flex items-center bg-red-100 text-red-800 text-sm px-4 py-2 rounded transition transform hover:scale-105"
        >
          {{ permission }}
          <button
            class="ml-2 text-blue-700 hover:text-red-600 focus:outline-none"
            @click.stop="removePermission(permission)"
          >
            &times;
          </button>
        </span>
      </template>
      <span v-else class="text-gray-400 text-sm">Click to select permissions</span>
    </div>

    <!-- Dropdown -->
    <TransitionRoot
      :show="dropdownOpen"
      enter="transition ease-out duration-150"
      enter-from="opacity-0 translate-y-1"
      enter-to="opacity-100 translate-y-0"
      leave="transition ease-in duration-100"
      leave-from="opacity-100 translate-y-0"
      leave-to="opacity-0 translate-y-1"
    >
      <div
        class="absolute z-10 mt-2 w-[50%] bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      >
        <ul>
          <li
            v-for="permission in allPermissions"
            :key="permission"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            @click.stop="togglePermission(permission)"
          >
            {{ permission }}
          </li>
        </ul>
      </div>
    </TransitionRoot>
  </div>
</template>

<style scoped>
/* Optional custom scrollbar */
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
</style>
