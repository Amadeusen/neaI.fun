import { useEffect, useEffectEvent } from "react";

/**
 * Calls `handler` whenever `key` is pressed anywhere on the page (held-down
 * repeats are ignored, and the key's default action, like scrolling for
 * space, is prevented). The handler always sees the latest props and state.
 */
export function useKeyPress(key: string, handler: () => void) {
  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key !== key || e.repeat) return;
    e.preventDefault();
    handler();
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
