<template>
  <slot />
</template>

<script setup lang="ts">
import { useWidgetParser, type ExpandLayoutItem } from '~/composables/useWidgetParser';
import type { Tab, Widget } from '~/types';
import { useTemplate } from '~/composables/useTemplate';
import { CODE, PROVIDE_KEY } from '~/constants';
import type { ToastProviderProps } from '~/providers/ToastProvider.vue';

const props = defineProps<{widgets: Widget.Item[]}>();
const { convertToLayoutItem } = useWidgetParser();
const toast = inject<ToastProviderProps>(PROVIDE_KEY.TOAST) || { show: () => {} };
const layout = ref<ExpandLayoutItem[]>([]);
watch(() => props.widgets, (widgets) => {
  layout.value = widgets.map(item => convertToLayoutItem(item));
}, { deep: true, immediate: true });

const addItem = (newItem?: Partial<ExpandLayoutItem>) => {
  const { getWidgetTemplate } = useTemplate(CODE.WIDGET);
  const newWidgetItem = getWidgetTemplate({
    posX: String(layout.value.length % 4),
    posY: String(layout.value.length + 4),
    sizeX: String(1),
    sizeY: String(1),
    content: { title: 'New Widget' },
    ...newItem
  });
  layout.value.push(convertToLayoutItem(newWidgetItem));
};
const removeItem = (id: Widget.Id) => {
  const targetIndex = layout.value.findIndex(item => item.i === id);
  layout.value.splice(targetIndex, 1);
};

const updateLayout = async (dashboardId: Tab.Id, body: Partial<Tab.Item>) => {
  try {
    const result = await useFetch(`/api/dashboard/${dashboardId}`, { method: 'PATCH', body: JSON.stringify(body) });
    return result;
  } catch (error: any) {
    toast.show({ message: error.message });
  }
};

const updateWidget = async <WidgetType, >(tabId: Tab.Id, widgetId: Widget.Id, body: Partial<Widget.Item<WidgetType>>) => {
  try {
    const result = await useFetch< Tab.Item>(`/api/dashboard/${tabId}/widget/${widgetId}`, { method: 'PATCH', body: JSON.stringify(body) });
    if (result.data.value) {
      layout.value = result.data.value.widgets.map(item => convertToLayoutItem(item));
    }
    return result;
  } catch (error: any) {
    toast.show({ message: error.message });
  }
};

export interface DashboardProvider {
  layout: typeof layout;
  updateLayout: typeof updateLayout;
  updateWidget: typeof updateWidget;
  addItem: typeof addItem;
  removeItem: typeof removeItem;
}
provide<DashboardProvider>(PROVIDE_KEY.DASHBOARD, {
  layout,
  updateLayout,
  updateWidget,
  addItem,
  removeItem
});
</script>
