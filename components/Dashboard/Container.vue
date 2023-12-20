<template>
  <VRow>
    <VCol>
      Last Updated: {{ dayjs(lastUpdateTime).format('YYYY-MM-DD HH:mm:ss') }}
      <VBtn
        variant="plain"
        size="small"
        icon="mdi-refresh-auto"
        :color="autoReloadColor"
        @click="toggleAutoReload"
      />
    </VCol>
    <VSpacer />
    <VCol class="d-flex">
      <VSwitch
        v-model="isEditMode"
        :label="isEditMode? 'edit' : 'read'"
        hide-details
        @change="toggleMode"
      />
      <VCheckbox
        v-if="isEditMode"
        v-model="isHideContent"
        hide-details
        label="hide content"
      />
      <VBtn v-if="isEditMode" size="small" @click="onClickSave">
        Save
      </VBtn>
    </VCol>
  </VRow>
  <GridLayout
    :layout="layout"
    :col-num="4"
    :max-rows="4"
    :row-height="240"
    :is-draggable="isEditMode"
    :is-resizable="isEditMode"
    :responsive="false"
    :breakpoints="{}"
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
        :data="(item.data as Pick<IWidget<unknown>, 'type'>)"
        :hide-content="isEditMode && isHideContent"
        @remove-widget="removeWidget(item.i)"
      />
    </GridItem>
  </GridLayout>
</template>
<script setup lang="ts">
import type { LayoutItem } from 'vue3-grid-layout-next/dist/helpers/utils.d.ts';
import { toRaw } from 'vue';
import dayjs from 'dayjs';
import type { IWidget } from '~/types';

const props = defineProps<{
  tabData: any;
  mode: Boolean
}>();
const emits = defineEmits(['change-edit-mode', 'save-widgets']);

interface ExpandLayoutItem extends LayoutItem {
  data?: IWidget<unknown>;
}
const widgetList = computed<IWidget<unknown>[]>(() => (props.tabData) ? toRaw(props.tabData.widgets) : []);
const layout = ref<ExpandLayoutItem[]>([]);
const lastUpdateTime = ref('');
watch(widgetList, (value) => {
  layout.value = value.map((widget) => {
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
  lastUpdateTime.value = new Date().toISOString();
}, { immediate: true });

// handle auto reload
const autoReload = ref<ReturnType <typeof setTimeout>>();
const autoReloadColor = computed(() => (autoReload.value) ? 'primary' : '');
const toggleAutoReload = () => {
  const reloader = () => {
    autoReload.value = setTimeout(() => {
      lastUpdateTime.value = new Date().toISOString();
      reloader();
    }, 10 * 100);
  };
  if (autoReload.value || isEditMode.value) {
    clearTimeout(autoReload.value);
    console.log(autoReload.value);
  } else {
    reloader();
  }
};

// handle mode
const isEditMode = ref(props.mode);
const isHideContent = ref(true);
const toggleMode = () => {
  emits('change-edit-mode', isEditMode);
  if (isEditMode.value) {
    toggleAutoReload();
  }
};

const setDashboardList = async (widgets :LayoutItem[]) => {
  const body = { id: props.tabData.id, widgets };
  const result = await fetch('/api/dashboard', { method: 'POST', body: JSON.stringify(body) }).then(res => res.json());
  return result;
};
const save = (data: LayoutItem[]) => {
  return setDashboardList(data);
};
const onClickSave = () => {
  save(layout.value)
    .then((result) => {
      console.log(result);
      isEditMode.value = false;
    });
};
const removeWidget = (id: string) => {
  const targetIndex = layout.value.findIndex(item => item.i === id);
  layout.value.splice(targetIndex, 1);
};

</script>
<style lang="scss" scoped>
.grid-item {
  background-color: #fff;
}
</style>
