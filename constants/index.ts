export const CODE = {
  TAB: 'tab',
  WIDGET: 'widget'
} as const;

export const PROVIDE_KEY = {
  TOAST: Symbol('toast') as InjectionKey<string>,
  DASHBOARD: Symbol('toast') as InjectionKey<string>
} as const;

export const WIDGET_TYPE = {
  INDICATOR: 'Indicator',
  RANK: 'Rank',
  LIST: 'List',
  PIE: 'Pie',
  BAR: 'Bar',
  LINE: 'Line',
  SCATTER: 'Scatter'
} as const;

export const DATA_SOURCE_TYPE = {
  EMPTY: '',
  WEALTH_BY_AGE_GROUP: 'WealthByAgeGroup'
} as const;
