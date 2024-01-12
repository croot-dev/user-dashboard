<template>
  <v-row>
    <v-col>
      <DashboardContainerForm
        :initial-data="tabData.globalSetting"
        @update:value="onUpdateForm"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      Last Updated: {{ dayjs(lastUpdateTime).format('YYYY-MM-DD HH:mm:ss') }}
      <v-btn
        v-show="isEditMode === false"
        variant="plain"
        size="small"
        icon="mdi-refresh-auto"
        :color="autoReloadColor"
        @click="onClickAutoReload"
      />
    </v-col>
    <v-spacer />
    <v-col class="d-flex">
      <v-switch
        v-model="isEditMode"
        :label="isEditMode? 'edit' : 'read'"
        hide-details
        @change="onChangeMode"
      />
      <v-checkbox
        v-if="isEditMode"
        v-model="isHideContent"
        hide-details
        label="hide content"
      />
      <v-btn v-if="isEditMode" size="small" @click="onClickSave">
        Save
      </v-btn>
    </v-col>
  </v-row>
  <GridLayout
    :layout="layout"
    :col-num="4"
    :max-rows="4"
    :row-height="240"
    :is-draggable="isEditMode"
    :is-resizable="isEditMode"
    :responsive="false"
  >
    <GridItem
      v-for="(item, index) in layout"
      :key="index"
      :static="item.static"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      class="grid-item"
    >
      <WidgetContainer
        :data="item.data"
        :hide-content="isEditMode && isHideContent"
        :is-edit="isEditMode"
        @remove-widget="handleRemoveWidget(item.i)"
      />
    </GridItem>
  </GridLayout>
</template>

<script setup lang="ts">
import { GridLayout, GridItem } from 'vue3-grid-layout-next';
import type { LayoutItem } from 'vue3-grid-layout-next/dist/helpers/utils.d.ts';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import type { Tab, Widget } from '~/types';
import DashboardContainerForm from '~/components/Dashboard/ContainerForm.vue';
import WidgetContainer from '~/components/Widget/Container.vue';
import { useTimer } from '~/composables/useTimer';
import { useDatasetStore } from '~/stores/dataset';

const props = defineProps<{
  tabData: Tab.Item;
}>();
const emits = defineEmits(['change-edit-mode', 'save-widgets']);

// handle layout data
interface ExpandLayoutItem extends LayoutItem {
  data: Widget.Item & Widget.Content;
}
const dataset = useDatasetStore();
const lastUpdateTime = ref('');
const layout = ref<ExpandLayoutItem[]>([]);
const parseToLayout = (tabWidgetData: Widget.Item[]) => {
  const widgetList = Array.isArray(tabWidgetData) ? tabWidgetData : [];
  return widgetList.map((widget) => {
    const x = Number(widget.posX);
    const y = Number(widget.posY);
    const w = Number(widget.sizeX);
    const h = Number(widget.sizeY);
    return {
      i: widget.uuid,
      x,
      y,
      w,
      h,
      static: false,
      data: { type: widget.type, ...widget.content }
    } as LayoutItem;
  });
};
watch(() => dataset.initialized, (dataLoaded) => {
  if (dataLoaded) {
    layout.value = parseToLayout(props.tabData.widgets || []) as ExpandLayoutItem[];
    lastUpdateTime.value = new Date().toISOString();
  }
}, { immediate: true });

// handle auto reload
const updatedTimer = useTimer(() => {
  lastUpdateTime.value = new Date().toISOString();
  return !isEditMode.value;
}, 10 * 100);
const autoReloadColor = computed(() => (updatedTimer.isRunning.value) ? 'primary' : '');
const onClickAutoReload = () => {
  if (!isEditMode.value) {
    updatedTimer.toggle();
  }
};
onBeforeUnmount(() => {
  if (updatedTimer.isRunning.value) {
    updatedTimer.stop();
  }
});

// handle edit
const isEditMode = ref(false);
const isHideContent = ref(true);
const onChangeMode = () => {
  if (updatedTimer.isRunning.value) {
    updatedTimer.stop();
  }
  emits('change-edit-mode', isEditMode);
};

// handle form
const onUpdateForm = async (data: Widget.Setting) => {

  // await fetch('/api/dashboard', { method: 'PATCH', body: JSON.stringify(body) }).then(res => res.json());
};

// handle save
const updateDashboardList = async (widgets :LayoutItem[]) => {
  const body = { widgets };
  const result = await useFetch(`/api/dashboard/${props.tabData.id}`, { method: 'PATCH', body: JSON.stringify(body) });
  return result.data;
};
const save = (data: LayoutItem[]) => {
  return updateDashboardList(data);
};
const onClickSave = () => {
  save(layout.value)
    .then((result) => {
      console.log(result);
      isEditMode.value = false;
    });
};

// handle remove widget
const removeWidget = async (widgetId: Widget.Key) => {
  const { data } = await useFetch(`/api/dashboard/${props.tabData.id}/${widgetId}`, { method: 'DELETE' });
  console.log(data);
  return await true;
};
const handleRemoveWidget = (id: string) => {
  removeWidget(id)
    .then((result) => {
      console.log(result);
      const targetIndex = layout.value.findIndex(item => item.i === id);
      layout.value.splice(targetIndex, 1);
    });
};
</script>

<style lang="scss" scoped>
.grid-item {
  background-color: #fff;
}
</style>
