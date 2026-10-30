import { useCallback, useEffect, useRef } from "react";

/**
 * `setTimeout` tied to a component's lifetime: every pending timeout is
 * cancelled on unmount, so leaving a game mid-animation never plays a late
 * sound or updates state on a page that is gone.
 */
export function useTimeouts() {
  const pending = useRef(new Set<number>());

  useEffect(() => {
    const ids = pending.current;
    return () => {
      ids.forEach((id) => window.clearTimeout(id));
      ids.clear();
    };
  }, []);

  return useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      pending.current.delete(id);
      fn();
    }, ms);
    pending.current.add(id);
  }, []);
}
