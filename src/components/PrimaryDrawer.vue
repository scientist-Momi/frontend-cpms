<script setup>
// import { Transition } from 'vue'
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()

function close() {
  modal.close()
}
</script>

<template>
  <div v-if="modal.isOpen" class="fixed inset-0 z-50 flex">
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>

    <Transition
      enter-active-class="transition-transform duration-300"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-show="modal.isOpen"
        class="fixed z-60 w-120 max-w-full h-full bg-white shadow-xl flex flex-col top-0 right-0"
      >

        <header class="flex justify-between items-center font-medium text-gray-500 px-4 p-2 text-sm border-b bg-gray-100 border-gray-200">
          <slot name="header">Drawer Title</slot>
       <button
            class="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
            @click="modal.close()"
            aria-label="Close"
          >&times;</button>
        </header>

        <section class="p-4 overflow-y-auto flex-1">
          <slot> Drawer content goes here... </slot>
        </section>
      </aside>
    </Transition>
  </div>
</template>
