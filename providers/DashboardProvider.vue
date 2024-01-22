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
const emits = defineEmits<{
  'update:layout': [Tab.Item]
}>();
const { convertToLayoutItem } = useWidgetParser();
const toast = inject<ToastProviderProps>(PROVIDE_KEY.TOAST) || { show: () => {} };
const widgets = ref<Widget.Item[]>(props.widgets || []);
const layout = ref<ExpandLayoutItem[]>([]);

const resetLayout = () => {
  layout.value = (widgets.value).map(item => convertToLayoutItem(item));
};

const updateLayout = async (dashboardId: Tab.Id, body: Partial<Tab.Item>): Promise<Ref<Tab.Item> | void> => {
  try {
    const { data } = await useFetch(`/api/dashboard/${dashboardId}`, { method: 'PATCH', body: JSON.stringify(body) });
    if (Array.isArray(data.value.widgets)) {
      widgets.value = data.value.widgets;
      emits('update:layout', data.value);
      resetLayout();
    }
    return data;
  } catch (error: any) {
    toast.show({ message: error.message });
  }
};

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
const removeItem = (id: Widget.Id) => {
  const targetIndex = layout.value.findIndex(item => item.i === id);
  layout.value.splice(targetIndex, 1);
};

const updateWidget = async <WidgetType, >(tabId: Tab.Id, widgetId: Widget.Id, body: Partial<Widget.Item<WidgetType>>): Promise<Tab.Item | void> => {
  try {
    const { data } = await useFetch(`/api/dashboard/${tabId}/widget/${widgetId}`, { method: 'PATCH', body: JSON.stringify(body) });
    if (data.value) {
      widgets.value = data.value.widgets;
      resetLayout();
    }
    return { data };
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
