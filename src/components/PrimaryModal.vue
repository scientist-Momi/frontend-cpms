<script setup>
import { useModalStore } from '@/stores/modalStore'

const modal = useModalStore()
</script>

<template>
  <!-- Backdrop wrapper, always rendered if you want blur effect -->
  <div
    v-if="modal.isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm"
  >
    <!-- Transition directly wraps the modal box -->
    <Transition name="slide-up-modal">
      <div
        v-show="modal.isOpen"
        class="bg-gray-100 rounded shadow-lg w-[50vw] h-fit mt-[25vh] flex flex-col"
      >
        <!-- Header -->
        <div class="border-b border-gray-200 px-4 py-3 text-base font-semibold flex justify-between items-center">
          <slot name="header"></slot>
          <button
            class="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
            @click="modal.close()"
            aria-label="Close"
          >&times;</button>
        </div>
        <!-- Content -->
        <div class="overflow-y-hidden flex-1">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>


<style scoped>
/* Transition classes */
.slide-up-modal-enter-active,
.slide-up-modal-leave-active {
  transition: all 0.4s ease;
}

.slide-up-modal-enter-from,
.slide-up-modal-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-modal-enter-to,
.slide-up-modal-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-up-modal-enter-active {
  outline: 2px solid red;
}

</style>
