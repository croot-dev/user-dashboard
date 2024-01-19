<template>
  <div class="tab-wrapper">
    <v-btn @click="onClickAddDashboard">
      Add Dashboard
    </v-btn>
    <v-tabs
      v-model="currentTabIndex"
      show-arrows
    >
      <v-tab v-for="(tabData, i) in tabList" :key="i" class="tab-item">
        {{ `${tabData.title} (${tabData.id})` }}
      </v-tab>
    </v-tabs>
  </div>
  <div class="content-wrapper">
    <v-window v-model="currentTabIndex">
      <v-window-item
        v-for="(tabData, tabIndex) in tabList"
        :key="tabData.id"
        :value="tabIndex"
        :transition="false"
        :reverse-transition="false"
      >
        <DashboardProvider :widgets="tabData.widgets">
          <DashboardContainer v-if="tabIndex === currentTabIndex" :tab-data="tabData" />
        </DashboardProvider>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Tab } from '~/types';
import DashboardContainer from '~/components/Dashboard/Container.vue';
import DashboardProvider from '~/providers/DashboardProvider.vue';

// handle list data
const tabList = ref<Tab.Item[]>([]);
const currentTabIndex = ref<number|null>(null);
const getDashboardList = async () => {
  try {
    const { data } = await useFetch<Tab.Item[]>('/api/dashboard');
    if (data.value) {
      tabList.value = data.value;
      if (data.value.length > 0) {
        currentTabIndex.value = 0;
      }
    }
  } catch (error) {
    debugger;
  }
};
getDashboardList();

const onClickAddDashboard = async () => {
  const { data } = await useFetch('/api/dashboard', { method: 'POST', body: JSON.stringify({ title: 'NewDashboard' }) });
  console.log(data);
};
</script>

<style lang="scss" scoped>
.content-wrapper {
  overflow: auto;
  flex: 1 auto;
  margin: 0 8px 8px;
  background-color: #fefefe;
}
</style>
