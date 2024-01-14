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
      <template v-if="isEditMode">
        <v-btn size="small" @click="onClickAdd">
          Add
        </v-btn>
        <v-btn size="small" @click="onClickSave">
          Save
        </v-btn>
      </template>
    </v-col>
  </v-row>
  <GridLayout
    v-model:layout="layout"
    :col-num="4"
    :max-rows="isEditMode ? Infinity : 4"
    :row-height="240"
    :is-draggable="isEditMode"
    :is-resizable="isEditMode"
    :responsive="false"
    :vertical-compact="true"
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
      :max-w="2"
      :max-h="2"
      class="grid-item"
    >
      <WidgetContainer
        :data="item.data"
        :global-setting="tabData.globalSetting"
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
import { CODE } from '~/constants';

const { show } = inject('toast');
const props = defineProps<{
  tabData: Tab.Item;
}>();
const emits = defineEmits(['change-edit-mode', 'save-widgets']);

// handle layout data
interface ExpandLayoutItem extends LayoutItem {
  data: Widget.Item<any>;
}
const dataset = useDatasetStore();
const lastUpdateTime = ref('');
const layout = ref<ExpandLayoutItem[]>([]);
const parseToLayoutItem = <T, >(widget: Widget.Item<T>): ExpandLayoutItem => {
  const x = Number(widget.posX);
  const y = Number(widget.posY);
  const w = Number(widget.sizeX);
  const h = Number(widget.sizeY);
  return {
    i: widget.id,
    x,
    y,
    w,
    h,
    static: false,
    data: {
      type: widget.type,
      ...(widget.setting && { setting: widget.setting }),
      ...(widget.content && { content: widget.content })
    }
  } as ExpandLayoutItem;
};
const parseToWidgetItem = <T, >(widget: ExpandLayoutItem): Widget.Item<T> => {
  return {
    id: String(widget.i),
    posX: String(widget.x),
    posY: String(widget.y),
    sizeX: String(widget.w),
    sizeY: String(widget.h),
    type: widget.data.type,
    setting: toRaw(widget.data.setting),
    content: toRaw(widget.data.content)
  } as Widget.Item<T>;
};
watch(() => dataset.initialized, (dataLoaded) => {
  if (dataLoaded) {
    layout.value = (props.tabData.widgets || []).map(widget => parseToLayoutItem(widget)) as ExpandLayoutItem[];
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

const updateDashboard = async (body: Partial<Tab.Item>) => {
  const result = await useFetch(`/api/dashboard/${props.tabData.id}`, { method: 'PATCH', body: JSON.stringify(body) });
  show({ message: 'dashboard updated' });
  return result.data;
};

// handle form
const onUpdateForm = (globalSetting: Tab.globalSetting) => {
  updateDashboard({ globalSetting })
    .then((result) => {
      isEditMode.value = false;
    });
};

// handle save
const onClickSave = () => {
  const widgets = layout.value.map(widget => parseToWidgetItem(widget));
  updateDashboard({ widgets })
    .then((result) => {
      isEditMode.value = false;
    });
};
const onClickAdd = () => {
  const { getWidgetTemplate } = useTemplate(CODE.WIDGET);
  const newWidgetItem = getWidgetTemplate({
    posX: String(layout.value.length % 4),
    posY: String(layout.value.length + 4),
    sizeX: String(1),
    sizeY: String(1),
    content: { title: 'New Widget' }
  });
  layout.value.push(parseToLayoutItem(newWidgetItem));
};

const handleRemoveWidget = (id: string) => {
  const targetIndex = layout.value.findIndex(item => item.i === id);
  layout.value.splice(targetIndex, 1);
};
</script>

<style lang="scss" scoped>
.grid-item {
  background-color: #fff;
}
</style>
