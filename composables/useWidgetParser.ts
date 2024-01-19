import type { LayoutItem } from 'vue3-grid-layout-next/dist/helpers/utils';
import type { Widget } from '~/types';

export interface ExpandLayoutItem extends LayoutItem {
    data: Widget.Item<any>;
}

export const useWidgetParser = () => {
  const convertToLayoutItem = <WidgetType = unknown>(widget: Widget.Item<WidgetType>) => {
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
        id: widget.id,
        type: widget.type,
        title: widget.title,
        dataSourceType: widget.dataSourceType,
        ...(widget.setting && { setting: widget.setting }),
        ...(widget.content && { content: widget.content })
      }
    } as ExpandLayoutItem;
  };

  const convertToWidgetItem = <WidgetType, >(widget: ExpandLayoutItem): Widget.Item<WidgetType> => {
    return {
      id: String(widget.i),
      posX: String(widget.x),
      posY: String(widget.y),
      sizeX: String(widget.w),
      sizeY: String(widget.h),
      type: widget.data.type,
      title: widget.data.title,
      dataSourceType: widget.data.dataSourceType,
      setting: toRaw(widget.data.setting),
      content: toRaw(widget.data.content)
    } as Widget.Item<WidgetType>;
  };

  return {
    convertToLayoutItem,
    convertToWidgetItem
  };
};
