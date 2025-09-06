<template>
    <div class=" p-8 flex flex-col items-center">
      <span class="material-symbols-outlined text-red-500 text-6xl mb-4">block</span>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p class="text-gray-500 mb-6 text-center">
        You do not have permission to view this page.<br>
        Please contact your administrator or login with an authorised account.
      </p>
      <router-link to="/app/overview" class="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition">
        Return to Dashboard
      </router-link>
    </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-size: 3.5rem;
}
</style>
