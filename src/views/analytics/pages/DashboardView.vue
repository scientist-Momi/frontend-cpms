<script setup>
// Example props/data
const cards = [
  {
    icon: 'groups',
    iconBg: 'bg-white',
    iconColor: 'text-blue-600',
    label: 'Active customers',
    value: '202,123',
    delta: '+22,325',
    percent: '12.2%',
    deltaColor: 'text-green-600',
    period: 'last 12 months'
  },
  {
    icon: 'mail',
    iconBg: 'bg-white',
    iconColor: 'text-orange-500',
    label: 'Emails opened',
    value: '78,500',
    delta: '+22,325',
    percent: '12.2%',
    deltaColor: 'text-green-600',
    period: 'last 12 months'
  }
]
</script>

<template>
  <div class="flex gap-6">
    <div
      v-for="(card, idx) in cards"
      :key="idx"
      class="bg-white rounded-2xl shadow border border-gray-100 p-6 flex-1 min-w-[260px] max-w-[320px] flex flex-col gap-4"
    >
      <div :class="['w-12 h-12 flex items-center justify-center border border-gray-200 shadow rounded-xl mb-2', card.iconBg]">
        <span :class="['material-symbols-outlined text-3xl', card.iconColor]">{{ card.icon }}</span>
      </div>
      <div>
        <div class="text-gray-600 text-sm font-medium mb-2">{{ card.label }}</div>
        <div class="text-3xl font-medium text-gray-900 mb-2">{{ card.value }}</div>
        <div class="flex items-center gap-2 text-sm">
          <span :class="card.deltaColor">{{ card.delta }} ({{ card.percent }})</span>
          <span class="text-gray-400">&bull;</span>
          <span class="text-gray-400">{{ card.period }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
