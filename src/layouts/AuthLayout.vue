<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-between px-4">
    <div class="w-full max-w-[33rem] bg-white rounded-2xl p-8 border border-gray-200 my-auto">
      <router-view />
    </div>
    <footer class="w-full text-center text-xs text-gray-400 py-6">
      &copy; {{ new Date().getFullYear() }} Qwaklan. Crafted by
      <a
        href="https://oolumomi.dev"
        target="_blank"
        rel="noopener"
        class="text-blue-500 hover:underline"
      >
        Olamide Olumomi </a
      >.
    </footer>
  </div>
</template>
