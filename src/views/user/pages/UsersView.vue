<script setup>
import { ref, onMounted } from 'vue'
import UsersTable from '../components/UsersTable.vue'
import SecondaryStatsCard from '@/components/SecondaryStatsCard.vue'
// import DateBar from '@/components/DateBar.vue';
// import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
// import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const router = useRouter()

const date = ref()
const noOfActive = ref('')
const noOfInactive = ref('')

// const selectedRange = ref([null, null])

onMounted(() => {

  const startDate = new Date()
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7))
  date.value = [startDate, endDate]
  noOfActive.value = auth.users.filter((u) => u.enabled).length
  noOfInactive.value = auth.users.filter((u) => !u.enabled).length
})

// const datePickerUI = {
//   navBtnNext: 'text-red-600 hover:bg-red-50 rounded',
//   navBtnPrev: 'text-rose-600 hover:bg-rose-50  bg-red-900 rounded'
//   calendar: 'bg-white border border-gray-200 rounded shadow',
//   calendarCell: 'hover:bg-rose-100 text-gray-700 rounded',
//   menu: 'bg-white border border-gray-200 rounded-xl shadow-lg',
//   input: 'border border-gray-300 rounded focus:ring-rose-200',
// }
</script>

<template>
  <div>
    <div v-if="$route.name === 'Users'">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">User Overview</h1>
        <!-- <VueDatePicker
          v-model="date"
          range
          class="max-w-[21.8%]"
          :enable-time-picker="false"
        /> -->
        <div class="flex items-center gap-2">
          <!-- <SecondaryButton class="flex items-center gap-2">
            <span class="material-symbols-outlined"> file_save </span>
            <p>Export</p>
          </SecondaryButton> -->
          <PrimaryButton @click="router.push({ name: 'NewUser' })" class="flex items-center gap-2">
            <span class="material-symbols-outlined"> person_add </span>
            <p>New User</p>
          </PrimaryButton>
        </div>
      </div>
      <div class="flex gap-6 mb-4">
        <SecondaryStatsCard
          label="Total Users"
          :value="auth.users.length"
          icon="groups"
        />
        <SecondaryStatsCard
          label="Active Users"
          :value="noOfActive"
          icon="groups"
        />
        <SecondaryStatsCard
          label="Blocked Users"
          :value="noOfInactive"
          icon="groups"
        />
      </div>
      <UsersTable />
    </div>
    <router-view />
  </div>
</template>

<style>
.dp__theme_light {
  --dp-primary-color: #e11d48;
  --dp-primary-disabled-color: #fca5a5;
  --dp-primary-text-color: #fff;
  --dp-hover-color: #fee2e2;
  --dp-hover-text-color: #b91c1c;
  --dp-range-between-dates-background-color: #fecaca;
  --dp-range-between-dates-text-color: #b91c1c;
  --dp-border-color: #eeeeee;
  --dp-menu-border-color: #fecaca;
  --dp-highlight-color: #fee2e2;
  --dp-success-color: #e11d48;
  --dp-danger-color: #b91c1c;
  --dp-marker-color: #e11d48;
}
</style>
