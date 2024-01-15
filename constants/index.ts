export const CODE = {
  TAB: 'tab',
  WIDGET: 'widget'
} as const;

export const PROVIDE_KEY = {
  TOAST: Symbol('toast') as InjectionKey<string>
} as const;
