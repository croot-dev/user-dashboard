<template>
  <div class="tab-wrapper">
    <div class="tab-list">
      <div v-for="(tabData, i) in tabList" :key="i" class="tab-item">
        <TabItem v-bind="{ ...tabData }" />
      </div>
    </div>
  </div>
  <div class="content-wrapper">
    <slot name="content"></slot>
  </div>
</template>
<script setup lang="ts">
import { ITab } from '~/types';

const props = defineProps<{
  tabList: ITab[]
}>()
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