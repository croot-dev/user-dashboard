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
        @update:model-value="onUpdateMode"
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
        :tab-id="tabData.id"
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
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { useWidgetParser } from '~/composables/useWidgetParser';
import type { Tab, Widget } from '~/types';
import DashboardContainerForm from '~/components/Dashboard/ContainerForm.vue';
import WidgetContainer from '~/components/Widget/Container.vue';
import { useTimer } from '~/composables/useTimer';
import { useDatasetStore } from '~/stores/dataset';
import { PROVIDE_KEY } from '~/constants';
import type { ToastProviderProps } from '~/providers/ToastProvider.vue';
import type { DashboardProvider } from '~/providers/DashboardProvider.vue';

interface Props {
  tabData: Tab.Item;
}
const props = defineProps<Props>();
const toast = inject<ToastProviderProps>(PROVIDE_KEY.TOAST) as ToastProviderProps;

// handle layout data
const lastUpdateTime = ref('');
const dataset = useDatasetStore();
const {
  layout,
  updateLayout,
  addItem: addLayoutItem,
  removeItem: removeLayoutItem
} = inject<DashboardProvider>(PROVIDE_KEY.DASHBOARD) as DashboardProvider;
const {
  convertToWidgetItem
} = useWidgetParser();
const reset = () => {
  lastUpdateTime.value = new Date().toISOString();
};
watch(() => dataset.initialized, (loaded) => { (loaded) && reset(); }, { immediate: true });

// handle mode
const isEditMode = ref(false);
const isHideContent = ref(true);
const onUpdateMode = (value: boolean | null) => {
  if (value) {
    if (updatedTimer.isRunning.value) {
      updatedTimer.stop();
    }
  } else {
    reset();
  }
};

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

// handle form
const onUpdateForm = (globalSetting: Tab.GlobalSetting) => {
  updateLayout(props.tabData.id, { globalSetting })
    .then(() => {
      toast.show({ message: 'dashboard updated' });
      isEditMode.value = false;
    });
};

const onClickSave = () => {
  const widgets = layout.value.map(widget => convertToWidgetItem(widget));
  updateLayout(props.tabData.id, { widgets })
    .then(() => {
      toast.show({ message: 'dashboard updated' });
      isEditMode.value = false;
    });
};

const onClickAdd = () => {
  addLayoutItem();
};

const handleRemoveWidget = (id: Widget.Id) => {
  removeLayoutItem(id);
};
</script>

<style lang="scss" scoped>
.grid-item {
  background-color: #fff;
}
</style>
