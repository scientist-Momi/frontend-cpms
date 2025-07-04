<template>
  <aside
    class="transition-all duration-300 w-72 flex flex-col min-h-screen pt-2 px-4 animate-pulse"
  >
    <!-- Logo Skeleton -->
    <div class="flex items-center h-16 mb-4 border-b border-gray-200 gap-2">
      <div class="bg-gray-300 flex items-center p-1 rounded w-10 h-10"></div>
      <div class="flex flex-col gap-1">
        <div class="h-4 bg-gray-300 rounded w-24"></div>
        <div class="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
    <!-- Search Skeleton -->
    <div class="h-8 bg-gray-200 rounded mb-4"></div>
    <!-- Menu Items Skeleton -->
    <div class="flex-1 space-y-3">
      <div v-for="n in 5" :key="n" class="flex items-center gap-3">
        <div class="bg-gray-300 rounded w-8 h-8"></div>
        <div class="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
    <!-- Profile Skeleton -->
    <div class="flex items-center gap-3 mt-4">
      <div class="bg-gray-300 rounded-full w-10 h-10"></div>
      <div class="flex flex-col gap-1">
        <div class="h-4 bg-gray-200 rounded w-20"></div>
        <div class="h-3 bg-gray-100 rounded w-12"></div>
      </div>
    </div>
  </aside>
</template>
