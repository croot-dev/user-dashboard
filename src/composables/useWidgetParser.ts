/**
 * Vue3 그리드 레이아웃과 관련된 유틸리티 및 위젯 파서를 정의합니다.
 */
import type { LayoutItem } from 'vue3-grid-layout-next/dist/helpers/utils';

import type { Widget } from '~/types';

/**
 * 레이아웃 항목을 확장하여 위젯 데이터를 포함할 수 있도록 정의합니다.
 */
export interface ExpandLayoutItem extends LayoutItem {
  data: Widget.Item<any>;
}

/**
 * 위젯 파서를 사용하기 위한 함수를 정의합니다.
 */
export const useWidgetParser = () => {
  /**
   * 위젯을 레이아웃 항목으로 변환하는 함수입니다.
   * @param widget 위젯
   * @returns 변환된 레이아웃 항목
   */
  const convertToLayoutItem = <WidgetType = unknown>({ id, posX, posY, sizeX, sizeY, type, title, dataSourceType, setting, content }: Widget.Item<WidgetType>) => {
    const x = Number(posX);
    const y = Number(posY);
    const w = Number(sizeX);
    const h = Number(sizeY);
    return {
      i: id,
      x,
      y,
      w,
      h,
      static: false,
      data: {
        id,
        type,
        title,
        dataSourceType,
        ...(setting && { setting }),
        ...(content && { content })
      }
    } as ExpandLayoutItem;
  };

  /**
   * 레이아웃 항목을 위젯으로 변환하는 함수입니다.
   * @param widget 레이아웃 항목
   * @returns 변환된 위젯
   */
  const convertToWidgetItem = <WidgetType>({ i, x, y, w, h, data: { type, title, dataSourceType, setting, content } }: ExpandLayoutItem): Widget.Item<WidgetType> => {
    return {
      id: String(i),
      posX: String(x),
      posY: String(y),
      sizeX: String(w),
      sizeY: String(h),
      type,
      title,
      dataSourceType,
      setting: setting ? toRaw(setting) : undefined,
      content: content ? toRaw(content) : undefined
    } as Widget.Item<WidgetType>;
  };

  return {
    convertToLayoutItem,
    convertToWidgetItem
  };
};
