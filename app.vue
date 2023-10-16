<template>
  <div class="wrapper">
    <TabList :tabList="tabList">
      <template #content>
        <div class="widget-condition">
          <WidgetConditions @changeEditMode="changeEditMode" />
        </div>
        <div class="widget-board">
          <WidgetBoard :mode="isEditMode" :tabData="currentTab" />
        </div>
      </template>
    </TabList>
  </div>
</template>
<script setup lang="ts">
import { toRaw } from 'vue';

// handle mode
const isEditMode = ref(false);
const changeEditMode = (isEdit: boolean) => {
  isEditMode.value = isEdit
}

// handle list data
const tabList = ref([]);
const widgetList = ref([]);
const currentTabIndex = ref<number|null>(null);
// const currentTab = computed(() => {
//   return currentTabIndex.value? tabList.value[currentTabIndex.value] : null
// })
const currentTab = ref(null)
const getDashboardList = async () => {
  const data = await fetch('/api/dashboard').then((res) => res.json())
  tabList.value = data;
  if (data.length > 0) {
    currentTabIndex.value = 0;
  }
}
watch(currentTabIndex, (index) => {
  if (index !== null) {
    currentTab.value = tabList.value[index]
    widgetList.value = toRaw(currentTab.contents)
  }
})
onMounted(() => { getDashboardList() })

</script>
<style lang="scss" scoped>
:global(body) {
  margin: 0;
}

.wrapper {
  overflow: hidden;
  position: relative;
  width: 100vw;
  height: 100vh;
  margin: 0;
  background-color: #f1f1f1;
  display: flex;
  flex-direction: column;
}

.widget-condition {
}
.widget-board {
  width: 100%;
  max-width: 1200px;
  margin: 12px auto 0;
}
</style>
