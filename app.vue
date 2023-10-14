<template>
  <div class="wrapper">
    <TabList :tabList="tabList">
      <template #content>
        <div class="widget-condition">
          <WidgetConditions @changeEditMode="changeEditMode" />
        </div>
        <div class="widget-board">
          <WidgetBoard :mode="isEditMode" :widgetList="widgetList" @save-widgets="onSaveWidgets"/>
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
const getDashboardList = async () => {
  const data = await fetch('/api/dashboard').then((res) => res.json())
  tabList.value = data;
  if (data.length > 0) {
    currentTabIndex.value = 0;
  }
}
const setDashboardList = async (body) => {
  console.log(body)
  // await fetch('/api/dashboard', { method: "POST", body: JSON.stringify(body) })
}
const onSaveWidgets = (data) => {
  setDashboardList(data);
}
watch(currentTabIndex, (index) => {
  if (index !== null) {
    const currentTab: any = tabList.value[index]
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
