import type { CSSProperties } from "react";

const DEFAULT_COLORS = ["#ff7a59", "#ffc94d", "#7c5cff", "#2ec4b6", "#ff5d8f"];

/**
 * A one-shot confetti burst from the center of its parent (which should be
 * `relative`). Mount it to fire; give it a new `key` to fire again. Pieces
 * are laid out deterministically so server and client renders match.
 */
export function Confetti({
  count = 36,
  colors = DEFAULT_COLORS,
}: {
  count?: number;
  colors?: string[];
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.3;
        const distance = 90 + ((i * 37) % 80);
        const style = {
          background: colors[i % colors.length],
          "--dx": `${Math.cos(angle) * distance}px`,
          "--dy": `${Math.sin(angle) * distance + 40}px`,
          "--rot": `${(i * 47) % 360}deg`,
        } as CSSProperties;
        return (
          <span
            key={i}
            className={`confetti-piece absolute top-1/2 left-1/2 ${i % 2 ? "h-2 w-3" : "size-2.5 rounded-full"}`}
            style={style}
          />
        );
      })}
    </div>
  );
}
