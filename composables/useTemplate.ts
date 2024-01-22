import { deepMerge } from '~/utils';
import { CODE, WIDGET_TYPE } from '~/constants';
import type { Tab, Widget } from '~/types';

type Values<T extends Record<string, any>> = T[keyof T];

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
  const getTabTemplate = (customTabObject: Partial<Tab.Item>) => {
    const newObject = deepMerge.all([
      {},
      template[CODE.TAB],
      customTabObject,
      { id: generateKey(5) }
    ]) as Tab.Item;

    return newObject;
  };

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
