<template>
  <slot />
</template>

<script setup lang="ts">
import { PROVIDE_KEY } from '~/constants';
import type { Tab, Widget, API } from '~/types';
import { useTemplate } from '~/composables/useTemplate';
import { useWidgetParser, type ExpandLayoutItem } from '~/composables/useWidgetParser';

import type { ToastProviderProps } from '~/providers/ToastProvider.vue';

const props = defineProps<{widgets: Widget.Item[]}>();
const emits = defineEmits<{
  'update:layout': [Tab.Item]
}>();
const { storage } = useStorage();
const { convertToLayoutItem } = useWidgetParser();
const toast = inject<ToastProviderProps>(PROVIDE_KEY.TOAST) || { show: () => {} };
const widgets = ref<Widget.Item[]>(props.widgets || []);
const layout = ref<ExpandLayoutItem[]>([]);
const accessToken = storage.getItem('accessToken');

/**
 * 레이아웃을 초기화합니다.
 */
const resetLayout = () => {
  layout.value = (widgets.value).map(item => convertToLayoutItem(item));
};

/**
 * 레이아웃을 업데이트합니다.
 * @param {Tab.Id} dashboardId 대시보드 ID
 * @param {Partial<Tab.Item>} body 업데이트할 데이터
 * @returns {Promise<Ref<Tab.Item> | void>} 업데이트된 데이터 또는 void
 */
const updateLayout = async (dashboardId: Tab.Id, body: Partial<Tab.Item>): Promise<Ref<Tab.Item> | void> => {
  try {
    const { data } = await useLazyFetch<API.DashboardDetailResponse>(
      `/api/dashboard/${dashboardId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    if (Array.isArray(data.value?.body?.widgets)) {
      widgets.value = data.value.body.widgets;
      emits('update:layout', data.value.body);
      resetLayout();
    }
  } catch (error: any) {
    toast.show({ message: error.message });
  }
};

/**
 * 새 항목을 추가합니다.
 * @param {Partial<ExpandLayoutItem>} newItem 새 항목의 부분적인 정보
 */
const addItem = (newItem?: Partial<ExpandLayoutItem>) => {
  const { getWidgetTemplate } = useTemplate();
  const newWidgetItem = getWidgetTemplate({
    posX: String(layout.value.length % 4),
    posY: String(layout.value.length + 4),
    sizeX: String(1),
    sizeY: String(1),
    title: 'New Widget',
    ...newItem
  });
  layout.value.push(convertToLayoutItem(newWidgetItem));
};

/**
 * 항목을 제거합니다.
 * @param {Widget.Id} id 제거할 항목의 ID
 */
const removeItem = (id: Widget.Id) => {
  const targetIndex = layout.value.findIndex(item => item.i === id);
  layout.value.splice(targetIndex, 1);
};

/**
 * 위젯을 업데이트합니다.
 * @template WidgetType 위젯의 타입
 * @param {Tab.Id} tabId 탭 ID
 * @param {Widget.Id} widgetId 위젯 ID
 * @param {Partial<Widget.Item<WidgetType>>} body 업데이트할 데이터
 * @returns {Promise<Tab.Item | void>} 업데이트된 데이터 또는 void
 */
const updateWidget = async <WidgetType, >(tabId: Tab.Id, widgetId: Widget.Id, body: Partial<Widget.Item<WidgetType>>): Promise<Tab.Item | void> => {
  try {
    const { data } = await useFetch<API.DashboardDetailResponse>(
      `/api/dashboard/${tabId}/widget/${widgetId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    if (data.value?.body) {
      widgets.value = data.value.body.widgets;
      resetLayout();
      return data.value.body;
    }
  } catch (error: any) {
    toast.show({ message: error.message });
  }
};

onMounted(() => {
  resetLayout();
});
onBeforeUnmount(() => {
  resetLayout();
});

/**
 * 대시보드 제공자 객체를 정의합니다.
 * @interface DashboardProvider
 * @property {typeof layout} layout 레이아웃 상태
 * @property {typeof resetLayout} resetLayout 레이아웃 초기화 함수
 * @property {typeof updateLayout} updateLayout 레이아웃 업데이트 함수
 * @property {typeof updateWidget} updateWidget 위젯 업데이트 함수
 * @property {typeof addItem} addItem 항목 추가 함수
 * @property {typeof removeItem} removeItem 항목 제거 함수
 */
export interface DashboardProvider {
  layout: typeof layout;
  resetLayout: typeof resetLayout;
  updateLayout: typeof updateLayout;
  updateWidget: typeof updateWidget;
  addItem: typeof addItem;
  removeItem: typeof removeItem;
}

provide<DashboardProvider>(PROVIDE_KEY.DASHBOARD, {
  layout,
  resetLayout,
  updateLayout,
  updateWidget,
  addItem,
  removeItem
});
</script>
