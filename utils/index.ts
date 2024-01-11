import { WidgetTypeA, WidgetTypeB, WidgetTypeC, WidgetTypeD } from '~/components/Widget/Type';
import type { WidgetType } from '~/types';

export const getWidgetComponent = (typeCode : WidgetType) => {
  switch (typeCode) {
  case 'A' : return WidgetTypeA;
  case 'B' : return WidgetTypeB;
  case 'C' : return WidgetTypeC;
  case 'D' : return WidgetTypeD;
  }
};

export const toSnakeCase = (str: string) => {
  return str.replace(/ /g, '_').replace(/([A-Z])/g, $1 => ('_' + $1.toLowerCase()));
};
