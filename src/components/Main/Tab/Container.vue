<template>
  <div class="tab-wrapper">
    <v-btn @click="onClickAddDashboard">
      Add Dashboard
    </v-btn>
    <v-tabs
      v-model="currentTabIndex"
      show-arrows
    >
      <v-tab
        v-for="(tabData, key) in tabList"
        :key="key"
        class="tab-item"
        append-icon="mdi-close-circle-outline"
      >
        {{ `${tabData.title} (${tabData.id})` }}
        <template #append>
          <RemoveDialogButton
            :tab-id="tabData.id"
            :success-callback="() => {
              tabList.splice(key, 1);
              if (currentTabIndex === key) {
                currentTabIndex = 0;
              }
            }"
          />
        </template>
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
        <DashboardProvider
          v-if="tabIndex === currentTabIndex"
          :widgets="tabData.widgets"
          @update:layout="(newData) => tabList.splice(tabIndex, 1, Object.assign(tabData, newData))"
        >
          <DashboardContainer :tab-data="tabData" />
        </DashboardProvider>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { API, Tab } from '~/types';
import DashboardContainer from '~/components/Main/Dashboard/Container.vue';
import DashboardProvider from '~/providers/DashboardProvider.vue';
import RemoveDialogButton from './RemoveDialogButton.vue';

const { storage } = useStorage();
const accessToken = storage.getItem('accessToken');

// handle list data
const tabList = ref<Tab.Item[]>([]);
const currentTabIndex = ref<number|null>(null);
const getDashboardList = async () => {
  try {
    const { data } = await useFetch<API.DashboardListResponse>('/api/dashboard', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (data.value?.body) {
      tabList.value = data.value.body;
      if (tabList.value.length > 0) {
        currentTabIndex.value = 0;
      }
    }
  } catch (error) {
    // console.log(error);
  }
};
getDashboardList();

const onClickAddDashboard = async () => {
  const { data } = await useFetch<API.DashboardDetailResponse>('/api/dashboard', {
    method: 'POST',
    body: JSON.stringify({ title: 'NewDashboard' }),
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (data.value?.body) {
    tabList.value.push(data.value.body);
    currentTabIndex.value = tabList.value.length - 1;
  }
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
