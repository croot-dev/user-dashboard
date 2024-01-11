<template>
  <div class="tab-wrapper">
    <v-tabs v-model="currentTabIndex">
      <v-tab v-for="(tabData, i) in tabList" :key="i" class="tab-item">
        <span v-if="'prepend' in tabData" class="prepend">{{ tabData.prepend }}</span>
        <span class="title">{{ tabData.title }}</span>
        <span v-if="'append' in tabData" class="append">{{ tabData.append }}</span>
      </v-tab>
    </v-tabs>
  </div>
  <div class="content-wrapper">
    <v-window v-model="currentTabIndex">
      <v-window-item
        v-for="(tabData, i) in tabList"
        :key="i"
        :value="i"
      >
        <DashboardContainer :tab-data="tabData" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ITab } from '~/types';
import DashboardContainer from '~/components/Dashboard/Container.vue';

// handle list data
const tabList = ref<ITab[]>([]);
const currentTabIndex = ref<number|null>(null);
const getDashboardList = async () => {
  const data = await fetch('/api/dashboard').then(res => res.json());
  tabList.value = data;
  if (data.length > 0) {
    currentTabIndex.value = 0;
  }
};
getDashboardList();
</script>

<style lang="scss" scoped>
.tab-wrapper {
  flex: 0 50px;
}
.content-wrapper {
  overflow: hidden;
  flex: 1 auto;
  margin: 0 8px 8px;
  background-color: #fefefe;
}
.tab-list {
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: nowrap;
  height: 100%;
  padding: 4px 8px;
}
.tab-item {
  flex: 1 0 auto;
  padding: 2px 6px;
  background-color: darkblue;
  color: #fff;
}
.tab-item + .tab-item {
  margin-left: 12px;
}
</style>
