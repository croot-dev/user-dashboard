type TimerID = ReturnType <typeof setTimeout>

export const useTimer = (
  callback: () => Promise<any> | void = () => {},
  delay: number = 10 * 100
) => {
  const timerId = shallowRef<TimerID>(0 as unknown as TimerID);
  const isRunning = shallowRef<boolean>(false);

  const start = (): TimerID => {
    const reloader = () => {
      isRunning.value = true;
      timerId.value = setTimeout(async () => {
        const condition = typeof callback === 'function' ? await callback() : true;
        if (isRunning.value && condition) {
          reloader();
        }
      }, delay);
    };
    reloader();
    return timerId.value;
  };

  const stop = (): TimerID => {
    clearTimeout(timerId.value);
    isRunning.value = false;
    return timerId.value;
  };

  const toggle = (): TimerID => {
    return (isRunning.value) ? stop() : start();
  };

  onBeforeUnmount(() => {
    if (isRunning.value === true) {
      stop();
    }
  });

  return {
    timerId: readonly(unref(timerId)),
    isRunning: readonly(toRaw(isRunning)),
    toggle,
    start,
    stop
  };
};
