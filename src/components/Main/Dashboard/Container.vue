<template>
  <div class="form-container">
    <v-row>
      <v-col>
        <DashboardContainerForm
          :initial-data="tabData.globalSetting"
          @update:value="onUpdateForm"
        />
      </v-col>
    </v-row>
    <v-row align="center" style="padding: 0 20px">
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
      <v-col class="d-flex" align-self="center">
        <v-switch
          v-model="isEditMode"
          :label="isEditMode? 'edit' : 'read'"
          hide-details
          density="compact"
          @update:model-value="onModeUpdated"
        />
        <v-checkbox
          v-if="isEditMode"
          v-model="isHideContent"
          hide-details
          density="compact"
          label="hide content"
        />
        <template v-if="isEditMode">
          <v-spacer />
          <v-btn size="small" class="mt-1" @click="onClickAdd">
            Add
          </v-btn>
          <v-btn size="small" class="ml-2 mt-1" color="#051923" @click="onClickSave">
            Save
          </v-btn>
        </template>
      </v-col>
    </v-row>
  </div>
  <div v-if="layout.length > 0" style="background-color: #e9eCef">
    <div class="grid-container">
      <GridLayout
        v-model:layout="layout"
        :col-num="4"
        :max-rows="isEditMode ? Infinity : 4"
        :row-height="240"
        :is-draggable="isEditMode"
        :is-resizable="isEditMode"
        :responsive="false"
      >
        <GridItem
          v-for="(item, key) in layout"
          :key="key"
          :static="item.static"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :min-w="1"
          :min-h="1"
          :max-w="4"
          :max-h="2"
          class="grid-item"
        >
          <WidgetContainer
            :key="JSON.stringify({'mode': isEditMode, ...item})"
            :tab-id="tabData.id"
            :data="item.data"
            :global-setting="tabData.globalSetting"
            :hide-content="isEditMode && isHideContent"
            :is-edit="isEditMode"
            @remove-widget="handleRemoveWidget(item.i)"
          />
        </GridItem>
      </GridLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { GridLayout, GridItem } from 'vue3-grid-layout-next';
import { PROVIDE_KEY } from '~/constants';
import type { Tab, Widget } from '~/types';
import WidgetContainer from '~/components/Main/Widget/Container.vue';
import { useTimer } from '~/composables/useTimer';
import { useWidgetParser } from '~/composables/useWidgetParser';
import type { DashboardProvider } from '~/providers/DashboardProvider.vue';
import type { ToastProviderProps } from '~/providers/ToastProvider.vue';
import DashboardContainerForm from './ContainerForm.vue';

interface Props {
  tabData: Tab.Item;
}
const props = defineProps<Props>();

const { convertToWidgetItem } = useWidgetParser();
const updatedTimer = useTimer(() => {
  lastUpdateTime.value = new Date().toISOString();
  return !isEditMode.value;
}, 10 * 100);

const toast = inject<ToastProviderProps>(PROVIDE_KEY.TOAST)!;
const {
  layout,
  resetLayout,
  updateLayout,
  addItem: addLayoutItem,
  removeItem: removeLayoutItem
} = inject<DashboardProvider>(PROVIDE_KEY.DASHBOARD)!;

const isEditMode = ref(false); // 수정 모드 유무
const isHideContent = ref(true); // 컨텐츠 표시 유무
const lastUpdateTime = ref(new Date().toISOString()); // 최근 조회 시간
const autoReloadColor = computed(() => (updatedTimer.isRunning.value) ? '#05a3f2' : '');

/**
 * 대시보드 초기화
 */
const reset = () => {
  resetLayout();
  lastUpdateTime.value = new Date().toISOString();
};

/**
 * 대시보드 모드 변경 핸들러
 */
const onModeUpdated = (isEditing: boolean | null) => {
  if (isEditing === true) {
    if (updatedTimer.isRunning.value) {
      updatedTimer.stop();
    }
  } else {
    reset();
  }
};

/**
 * 자동 새로고침 핸들러
 */
const onClickAutoReload = () => {
  if (!isEditMode.value) {
    updatedTimer.toggle();
  }
};

/**
 * 대시보드 설정 업데이트
 * @param globalSetting 대시보드 공통 설정
 */
const onUpdateForm = (globalSetting: Tab.GlobalSetting) => {
  updateLayout(props.tabData.id, { globalSetting })
    .then(() => {
      toast.show({ message: 'dashboard updated' });
      isEditMode.value = false;
    });
};

/**
 * 위젯 삭제 핸들러
 */
const handleRemoveWidget = (id: Widget.Id) => {
  removeLayoutItem(id);
};

/**
 * 대시보드 위젯 업데이트
 */
const onClickSave = () => {
  const widgets = layout.value.map(widget => convertToWidgetItem(widget));
  updateLayout(props.tabData.id, { widgets })
    .then(() => {
      toast.show({ message: 'dashboard updated' });
      isEditMode.value = false;
    });
};

/**
 * 위젯 추가 이벤트 핸들러
 */
const onClickAdd = () => {
  isEditMode.value = false;
  addLayoutItem();

  // 추가된 위젯이 이동이 되지 않아 임의로 EditMode를 변환하여 해결.
  nextTick(() => {
    isEditMode.value = true;
  });
};

</script>

<style lang="scss" scoped>
.form-container {
  max-width: 1200px;
  margin: 0 auto;
}
.grid-container {
  max-width: 1200px;
  margin: 0 auto;
}
.grid-item {
  background-color: #fff;
}
</style>
