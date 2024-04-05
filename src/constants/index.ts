/**
 * UI 관련
 */
export const CODE = {
  TAB: 'tab',
  WIDGET: 'widget'
} as const;

export const FORMAT = {
  DATE: 'YYYY-MM-DD'
} as const;

/**
 * Provide ID
 */
export const PROVIDE_KEY = {
  TOAST: Symbol('toast') as InjectionKey<string>,
  DASHBOARD: Symbol('toast') as InjectionKey<string>
} as const;

/**
 * 위젯 유형
 */
export const WIDGET_TYPE = {
  INDICATOR: 'Indicator',
  RANK: 'Rank',
  LIST: 'List',
  PIE: 'Pie',
  BAR: 'Bar',
  LINE: 'Line',
  SCATTER: 'Scatter'
} as const;

export const WIDGET_INDICATOR_CALCULATOR = {
  SUM: 'SUM',
  AVG: 'AVG',
  COUNT: 'COUNT',
  MIN: 'MIN',
  MAX: 'MAX'
} as const;
/**
 * 통계 데이터 유형
 */
export const DATA_SOURCE_TYPE = {
  EMPTY: '',
  WEALTH_BY_AGE_GROUP: 'WealthByAgeGroup'
} as const;

export * from './route';
