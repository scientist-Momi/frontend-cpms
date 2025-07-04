<script setup>
import { ref } from 'vue'

const activities = ref([
  {
    time: '10:15',
    icon: 'person_add',
    iconBg: 'bg-green-500',
    iconColor: 'text-white',
    title: 'Created New Customer',
    subtitle: 'Added customer John Doe to the system.',
    // Optionally, you can add actions or extra fields as in the first array
  },
  {
    time: '11:00',
    icon: 'shopping_cart',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white',
    title: 'Created Transaction',
    subtitle: 'Processed a purchase for customer John Doe.',
  },
  {
    time: '16:45',
    icon: 'edit',
    iconBg: 'bg-yellow-500',
    iconColor: 'text-white',
    title: 'Edited Product',
    subtitle: 'Updated details of product "Wireless Mouse".',
  },
  {
    time: '09:45',
    icon: 'login',
    iconBg: 'bg-purple-500',
    iconColor: 'text-white',
    title: 'Login',
    subtitle: 'Signed in from Chrome on Windows.',
  },
  {
    time: '20:00',
    icon: 'logout',
    iconBg: 'bg-gray-400',
    iconColor: 'text-white',
    title: 'Logout',
    subtitle: 'Signed out from Safari on iPhone.',
  }
])

</script>

<template>
  <div class="w-3/5">
    <slot>

    </slot>
    <div class="mt-4">
      <div class="relative ml-6">
        <!-- Vertical line -->
        <div class="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div v-for="(activity, idx) in activities" :key="idx" class="relative flex items-start mb-8">
          <!-- Timeline Icon -->
          <div class="z-10">
            <div :class="['w-10 h-10 flex items-center justify-center rounded-full shadow', activity.iconBg]">
              <span :class="['material-symbols-outlined text-2xl', activity.iconColor]">{{ activity.icon }}</span>
            </div>
          </div>
          <!-- Activity Card -->
          <div class="ml-6 flex-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium text-gray-500">{{ activity.time }}</span>
              <span v-if="activity.action" class="ml-auto">
                <a :href="activity.action.link" class="inline-flex items-center px-3 py-1 bg-gray-100 text-xs rounded font-medium hover:bg-gray-200">
                  <span class="material-symbols-outlined text-base mr-1">{{ activity.action.icon }}</span>
                  {{ activity.action.label }}
                </a>
              </span>
            </div>
            <div class="mt-1 bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3">
              <div class="font-medium text-gray-900">{{ activity.title }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ activity.subtitle }}</div>
              <div v-if="activity.extra" class="mt-2">
                <a :href="activity.extra.link" :class="['text-xs font-medium hover:underline', activity.extra.color]">
                  {{ activity.extra.label }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
