import { deepMerge } from '~/utils';
import { CODE } from '~/constants';
import type { Tab, Widget } from '~/types';

type Values<T extends Record<string, any>> = T[keyof T];

const template: Record<Values<typeof CODE>, Tab.Item | Widget.Item> = {
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
    type: 'A',
    sizeX: '',
    sizeY: '',
    posX: '',
    posY: '',
    content: { title: '' }
  }
};

export const useTemplate = (type: Values<typeof CODE>) => {
  const getTabTemplate = (customObject: Partial<Tab.Item>) => {
    const newObject = deepMerge.all([
      {},
      template[type],
      customObject,
      { id: generateKey(5) }
    ]) as Tab.Item;

    return newObject;
  };

  const getWidgetTemplate = <T = Widget.ContentA>(customObject: Partial<Widget.Item>) => {
    const newObject = deepMerge.all([
      {},
      template[type],
      customObject,
      { id: generateKey(5) }
    ]) as Widget.Item<T>;

    return newObject;
  };

  return {
    getTabTemplate,
    getWidgetTemplate
  };
};
