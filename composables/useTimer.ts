/**
 * TimerID는 setTimeout 함수의 반환 유형입니다.
 */
type TimerID = ReturnType<typeof setTimeout>;

/**
 * 타이머를 사용하기 위한 커스텀 훅입니다.
 * @param callback 타이머 콜백 함수
 * @param delay 타이머 지연(ms)
 * @returns 타이머 관련 기능을 제공하는 객체
 */
export const useTimer = (
  callback: () => Promise<any> | void = () => { },
  delay: number = 10 * 100
) => {
  const timerId = shallowRef<TimerID>(0 as unknown as TimerID);
  const isRunning = shallowRef<boolean>(false);

  /**
   * 타이머를 시작합니다.
   * @returns 타이머 식별자
   */
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

  /**
   * 타이머를 중지합니다.
   * @returns 중지된 타이머 식별자
   */
  const stop = (): TimerID => {
    clearTimeout(timerId.value);
    isRunning.value = false;
    return timerId.value;
  };

  /**
   * 타이머를 토글합니다.
   * @returns 토글된 타이머 식별자
   */
  const toggle = (): TimerID => {
    return (isRunning.value) ? stop() : start();
  };

  onBeforeUnmount(() => {
    if (isRunning.value === true) {
      stop();
    }
  });

  return {
    timerId: readonly(unref(timerId)), // 읽기 전용 타이머 식별자
    isRunning: readonly(toRaw(isRunning)), // 읽기 전용 isRunning 상태
    toggle, // 타이머 토글 함수
    start, // 타이머 시작 함수
    stop // 타이머 중지 함수
  };
};
