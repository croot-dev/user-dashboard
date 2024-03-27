import { deepMerge } from '~/utils';
import { CODE, WIDGET_TYPE } from '~/constants';
import type { Tab, Widget } from '~/types';

interface Template {
  [CODE.TAB]: Tab.Item;
  [CODE.WIDGET]: Widget.Item;
}

const template: Template = {
  [CODE.TAB]: {
    id: '',
    title: '',
    globalSetting: {
      startDate: '',
      endDate: '',
      autoReload: false
    },
    widgets: []
  },
  [CODE.WIDGET]: {
    id: '',
    type: WIDGET_TYPE.INDICATOR,
    sizeX: '',
    sizeY: '',
    posX: '',
    posY: '',
    title: '',
    dataSourceType: '',
    content: {
      maintext: ''
    }
  }
};

export const useTemplate = () => {
  /**
   * 탭 템플릿 생성 함수
   * @param customTabObject 사용자 정의 탭 객체
   * @returns 생성된 탭 객체
   */
  const getTabTemplate = (customTabObject: Partial<Tab.Item>) => {
    const newObject = deepMerge.all([
      {},
      template[CODE.TAB],
      customTabObject,
      { id: generateKey(5) }
    ]) as Tab.Item;

    return newObject;
  };

  /**
   * 위젯 템플릿 생성 함수
   * @param customWidgetObject 사용자 정의 위젯 객체
   * @returns 생성된 위젯 객체
   */
  const getWidgetTemplate = <T = Widget.Content[typeof WIDGET_TYPE.INDICATOR]>(customWidgetObject: Partial<Widget.Item>) => {
    const newObject = deepMerge.all([
      {},
      template[CODE.WIDGET],
      customWidgetObject,
      { id: generateKey(5) }
    ]) as Widget.Item<T>;

    return newObject;
  };

  return {
    getTabTemplate,
    getWidgetTemplate
  };
};
