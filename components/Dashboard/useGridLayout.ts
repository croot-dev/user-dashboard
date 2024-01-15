import { useWidgetParser, type ExpandLayoutItem } from './useWidgetParser';
import type { Widget } from '~/types';
import { useTemplate } from '~/composables/useTemplate';
import { CODE } from '~/constants';

export const useGridLayout = () => {
  const { convertToLayoutItem, convertToWidgetItem } = useWidgetParser();
  const layout = ref<ExpandLayoutItem[]>([]);

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

  return {
    layout,
    addItem,
    removeItem
  };
};
