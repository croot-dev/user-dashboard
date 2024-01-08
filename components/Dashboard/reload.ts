interface Props {
  defaultState?: boolean;
  interval?: number;
  callback?: () => void;
}
export const useReload = ({ defaultState = false, interval = 10, callback = () => undefined }: Props) => {
  const autoReload = ref<ReturnType <typeof setTimeout>>();
  const activeAutoReload: () => typeof autoReload.value = () => {
    const reloader = () => {
      autoReload.value = setTimeout(() => {
        typeof callback === 'function' && callback();
        reloader();
      }, interval * 100);
    };
    if (!autoReload.value) {
      reloader();
    }

    return autoReload.value;
  };
  const inactiveAutoReload: () => typeof autoReload.value = () => {
    if (autoReload.value) {
      clearTimeout(autoReload.value);
      console.log(autoReload.value);
    }

    return autoReload.value;
  };
  const toggleAutoReload = () => (autoReload.value) ? inactiveAutoReload() : activeAutoReload();

  if (defaultState) {
    toggleAutoReload();
  }

  return {
    autoReload,
    activeAutoReload,
    inactiveAutoReload,
    toggleAutoReload
  };
};
