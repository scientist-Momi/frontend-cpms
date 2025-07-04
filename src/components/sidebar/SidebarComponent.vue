<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUIStore } from '@/stores/uiStore'
import { sidebarMenu } from '@/constants/menu'
import { useAuthStore } from '@/stores/authStore'
import SidebarSearch from './SidebarSearch.vue'
import SidebarProfile from './SidebarProfile.vue'

const ui = useUIStore()
const route = useRoute()
const auth = useAuthStore()

const filteredMenu = computed(() =>
  sidebarMenu.filter((item) => {
    return item.alwaysVisible || auth.hasPermission(item.permission)
  }),
)

const filteredRole = computed(() => {
  if(auth.user?.role == 'MAIN_ADMIN'){
    return "SUPER ADMIN"
  }else if(auth.user?.role == 'MINOR_ADMIN'){
    return "ADMIN"
  }else{
    return "..."
  }
}

)
</script>

<template>
  <aside
    :class="['transition-all duration-300', ui.sidebarCollapsed ? 'w-16' : 'w-72']"
    class="flex flex-col min-h-screen pt-2 px-4"
  >
    <div class="flex items-center h-16 mb-4 border-b border-gray-200 gap-2">
      <div class="bg-gray-900 flex items-center p-1 rounded">
        <span class="material-symbols-outlined logo text-white"> public </span>
      </div>

      <div v-if="!ui.sidebarCollapsed" class="flex-row transition-all duration-200">
        <p class="text-sm font-semibold">Qweklin</p>
        <small>{{filteredRole}}</small>
      </div>
    </div>

    <sidebar-search />

    <nav class="flex-1 space-y-2 text-gray-600" :class="{ 'items-center': ui.sidebarCollapsed }">
      <router-link
        v-for="item in filteredMenu"
        :key="item.route"
        :to="{ name: item.title }"
        class="flex items-center px-3 py-2 rounded hover:bg-white hover:shadow transition-all duration-200"
        :class="{
          'justify-center': ui.sidebarCollapsed,
          'gap-3': !ui.sidebarCollapsed,
          'bg-white shadow': route.path.startsWith(item.route),
        }"
      >
        <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
        <span
          v-if="!ui.sidebarCollapsed"
          class="font-medium whitespace-nowrap transition-opacity duration-200"
        >
          {{ item.title }}
        </span>
      </router-link>
    </nav>

    <sidebar-profile />

  </aside>
</template>

<style scoped>
.material-symbols-outlined {
  font-size: 24px;
}

.logo {
  font-size: 32px;
}

.cmd {
  font-size: 18px;
}
</style>
