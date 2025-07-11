<script setup>
import { useProductStore } from '@/stores/productStore';
import SecondaryStatsCard from '@/components/SecondaryStatsCard.vue';
import SecondaryButton from '@/components/buttons/SecondaryButton.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';

const product = useProductStore()
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">Product Overview</h1>
        <div class="flex items-center gap-2">
          <SecondaryButton class="flex items-center gap-2">
            <span class="material-symbols-outlined"> file_save </span>
            <p>Export</p>
          </SecondaryButton>
          <PrimaryButton
            @click="router.push({ name: 'NewCustomer' })"
            class="flex items-center gap-2"
          >
            <span class="material-symbols-outlined"> person_add </span>
            <p>New Product</p>
          </PrimaryButton>
        </div>
      </div>
      <div class="flex gap-6 mb-4">
        <SecondaryStatsCard
          label="Total Products"
          :value="product.products.length"
          icon="groups"
        />
        <SecondaryStatsCard
          label="Total Products Sold"
          :value="product.products.length"
          icon="attach_money"
        />
        <SecondaryStatsCard
          label="Total Products Unsold"
          :value="product.products.length"
          icon="money_off"
        />
        <!-- <SecondaryStatsCard
          label="Total Payments Received"
          :value="product.products.length"
          icon="paid"
        /> -->
      </div>
  </div>
</template>

<style scoped>
</style>
