<template>
  <v-row>
    <v-col>
      <DashboardContainerForm />
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
import type { ITab, IWidget, WidgetContent, WidgetKey } from '~/types';
import DashboardContainerForm from '~/components/Dashboard/ContainerForm.vue';
import WidgetContainer from '~/components/Widget/Container.vue';
import { useTimer } from '~/composable/useTimer';
import { useDatasetStore } from '~/stores/dataset';

const props = defineProps<{
  tabData: ITab;
}>();
const emits = defineEmits(['change-edit-mode', 'save-widgets']);

// handle layout data
interface ExpandLayoutItem extends LayoutItem {
  data: IWidget<unknown> & WidgetContent;
}
const dataset = useDatasetStore();
const lastUpdateTime = ref('');
const layout = ref<ExpandLayoutItem[]>([]);
const getLayoutData = (tabWidgetData: IWidget<unknown>[]) => {
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
    layout.value = getLayoutData(props.tabData.widgets || []) as ExpandLayoutItem[];
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

// handle edit
const isEditMode = ref(false);
const isHideContent = ref(true);
const onChangeMode = () => {
  if (updatedTimer.isRunning.value) {
    updatedTimer.stop();
  }
  emits('change-edit-mode', isEditMode);
};

// handle save
const updateDashboardList = async (widgets :LayoutItem[]) => {
  const body = { id: props.tabData.id, widgets };
  const result = await fetch('/api/dashboard', { method: 'POST', body: JSON.stringify(body) }).then(res => res.json());
  return result;
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
const removeWidget = async (widgetId: WidgetKey) => {
  const body = { id: props.tabData.id, widgetId };
  // const result = await fetch('/api/dashboard', { method: 'DELETE', body: JSON.stringify(body) }).then(res => res.json());
  // return result;
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
