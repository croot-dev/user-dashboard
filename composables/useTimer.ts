type TimerID = ReturnType <typeof setTimeout>

export const useTimer = (
  callback: () => void = () => {},
  delay: number = 10 * 100
) => {
  const timerId = shallowRef<TimerID>();
  const isRunning = shallowRef<boolean>(false);

  const start = () => {
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

  const stop = () => {
    clearTimeout(timerId.value);
    isRunning.value = false;
    return timerId.value;
  };

  const toggle = () => {
    return (isRunning.value) ? stop() : start();
  };

  return {
    timerId: toRaw(timerId),
    isRunning: toRaw(isRunning),
    toggle,
    start,
    stop
  };
};
