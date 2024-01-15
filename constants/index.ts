export const CODE = {
  TAB: 'tab',
  WIDGET: 'widget'
} as const;

export const PROVIDE_KEY = {
  TOAST: Symbol('toast') as InjectionKey<string>
} as const;

export const WIDGET_TYPE = {
  INDICATOR: 'Indicator',
  RANK: 'Rank',
  LIST: 'List',
  PIE: 'Pie',
  BAR: 'Bar',
  LINE: 'Line'
};
