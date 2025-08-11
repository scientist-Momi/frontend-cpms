<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

// ✅ New prop for passing a user object or just the ID
const props = defineProps({
  user: {
    type: [Object, Number], // Can pass a full user object or just their ID
    default: null
  }
})

const { getUserActivitiesById } = useAuth()
const route = useRoute()

// ✅ Decide which ID to use
const userId = computed(() => {
  if (props.user) {
    // If a full user object is passed
    if (typeof props.user === 'object' && props.user.id) {
      return props.user.id
    }
    // If just a number is passed
    if (typeof props.user === 'number') {
      return props.user
    }
  }
  // Else use route param fallback
  return Number(route.params.id)
})

const activities = ref([])

const mapActivity = (log) => {
  return {
    time: log.createdAt
      ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '',
    icon: resolveIcon(log.actionType || ''),
    iconBg: resolveIconBg(log.actionType || ''),
    iconColor: 'text-white',
    title: formatActionTitle(log),
    subtitle: log.details || ''
  }
}

function resolveIcon(actionType) {
  switch (actionType) {
    case 'CREATE_USER': return 'person_add'
    case 'CREATE_TRANSACTION': return 'shopping_cart'
    case 'UPDATE_PRODUCT': return 'edit'
    case 'SIGN_IN_USER': return 'login'
    case 'SIGN_OUT_USER': return 'logout'
    default: return 'info'
  }
}

function resolveIconBg(actionType) {
  switch (actionType) {
    case 'CREATE_USER': return 'bg-green-500'
    case 'CREATE_TRANSACTION': return 'bg-blue-500'
    case 'UPDATE_PRODUCT': return 'bg-yellow-500'
    case 'SIGN_IN_USER': return 'bg-purple-500'
    case 'SIGN_OUT_USER': return 'bg-gray-400'
    default: return 'bg-gray-300'
  }
}

function formatActionTitle(log) {
  const type = log?.actionType || 'UNKNOWN'
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase())
}

// ✅ Fetch activities dynamically
onMounted(async () => {
  try {
    const res = await getUserActivitiesById(userId.value)

    // Ensure we’re dealing with an array
    activities.value = Array.isArray(res.data)
      ? res.data.map(mapActivity)
      : []

  } catch (err) {
    console.error('Failed to load activities', err)
    activities.value = []
  }
})
</script>


<template>
  <div class="w-3/5">
    <slot></slot>
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

        <div v-if="!activities.length" class="text-gray-500 text-sm mt-4">No activities found for this user.</div>
      </div>
    </div>
  </div>
</template>
