import { useEffect, useRef, useState } from "react";

const TICK_MS = 100;

/**
 * A countdown clock. It compares against a fixed end time on every tick
 * instead of counting ticks, so it stays accurate even if the tab lags, and
 * time can be added mid-run. The interval is cleared on unmount.
 */
export function useCountdown() {
  const [msLeft, setMsLeft] = useState(0);
  const endsAtRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => stop, []);

  /**
   * Starts (or restarts) the clock. `onTick` runs on every tick with the time
   * left; `onEnd` runs once when it reaches zero.
   */
  const start = (
    durationMs: number,
    { onTick, onEnd }: { onTick?: (msLeft: number) => void; onEnd: () => void },
  ) => {
    stop();
    endsAtRef.current = performance.now() + durationMs;
    setMsLeft(durationMs);
    intervalRef.current = setInterval(() => {
      const left = Math.max(0, endsAtRef.current - performance.now());
      setMsLeft(left);
      onTick?.(left);
      if (left === 0) {
        stop();
        onEnd();
      }
    }, TICK_MS);
  };

  /** Adds time to a running clock (bonus seconds). */
  const add = (ms: number) => {
    endsAtRef.current += ms;
  };

  return { msLeft, start, stop, add };
}
