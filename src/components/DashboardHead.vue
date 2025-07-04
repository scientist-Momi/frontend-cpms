<script setup>
import { useUIStore } from '@/stores/uiStore'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { sidebarMenu } from '@/constants/menu'

const ui = useUIStore()
const route = useRoute()

// Build breadcrumbs from matched routes
const breadcrumbs = computed(() => {
  const crumbs = []

  // Iterate through all matched routes to build breadcrumb trail
  route.matched.forEach((matchedRoute, index) => {
    // Skip the root layout route
    if (matchedRoute.path === '/app') return

    // Get title from route meta or sidebar menu
    let title = ''
    if (matchedRoute.meta?.title) {
      title = matchedRoute.meta.title
    } else if (matchedRoute.name) {
      // Try to find in sidebar menu
      const menuItem = sidebarMenu.find(item =>
        item.route === matchedRoute.path ||
        matchedRoute.path.startsWith(item.route + '/')
      )
      title = menuItem?.title || matchedRoute.name
    }

    // Only add if we have a title
    if (title) {
      crumbs.push({
        title,
        path: matchedRoute.path,
        isLast: index === route.matched.length - 1
      })
    }
  })

  return crumbs
})

// Get current page for fallback
const currentPage = computed(() => {
  const matched = route.matched[route.matched.length - 1]
  if (matched?.meta?.title) {
    return { title: matched.meta.title, icon: matched.meta.icon || 'dashboard' }
  }
  return (
    sidebarMenu.find(item =>
      route.path === item.route || route.path.startsWith(item.route + '/')
    ) || { title: 'Dashboard', icon: 'dashboard' }
  )
})
</script>

<template>
  <header class="rounded-tl-2xl p-6 pb-5 flex gap-3 items-center border-b border-gray-200">
    <button
      @click="ui.toggleSidebar"
      class="text-gray-600 rounded flex items-center hover:bg-gray-200 p-1 cursor-pointer"
    >
      <span class="material-symbols-outlined">side_navigation</span>
    </button>
    <div class="flex items-center gap-2 border-l border-l-gray-200 px-4">
      <!-- Breadcrumb Trail -->
      <div v-if="breadcrumbs.length > 1" class="flex items-center gap-2">
        <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
          <span
            :class="[
              'text-base',
              crumb.isLast ? 'font-medium text-gray-900' : 'font-normal text-gray-400 hover:text-gray-600 cursor-pointer'
            ]"
            @click="!crumb.isLast && $router.push(crumb.path)"
          >
            {{ crumb.title }}
          </span>
          <span v-if="!crumb.isLast" class="text-gray-400 text-sm">></span>
        </template>
      </div>

      <!-- Fallback to single title if no breadcrumbs -->
      <span v-else class="font-medium text-base text-gray-900">
        {{ currentPage.title }}
      </span>
    </div>
  </header>
</template>

<style scoped>
.material-symbols-outlined {
  font-size: 20px;
}
</style>


