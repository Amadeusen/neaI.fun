import { useEffect, useRef, useState } from "react";

/**
 * Tracks an element's width / height ratio with a ResizeObserver. Attach the
 * returned ref to the element; `initial` is used for the server render and
 * until the first measurement.
 */
export function useAspectRatio<T extends HTMLElement>(initial: number) {
  const ref = useRef<T>(null);
  const [aspect, setAspect] = useState(initial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setAspect(width / height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, aspect] as const;
}
