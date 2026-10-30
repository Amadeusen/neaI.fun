import type { CSSProperties } from "react";

const LETTERS = ["S", "T", "A", "C", "K"];
const OFFSETS = [0, -3, 1, -2, 0];
const TILTS = [-4, 3, -2, 4, -3];

/** "STACK" with each letter on its own slightly wobbly block. */
export function StackTitle() {
  return (
    <span className="flex items-end gap-1" aria-hidden>
      {LETTERS.map((letter, i) => {
        const hue = 14 + i * 6;
        const style = {
          transform: `translateY(${OFFSETS[i]}px) rotate(${TILTS[i]}deg)`,
        } as CSSProperties;
        return (
          <span key={letter} style={style}>
            <span
              className="stagger-in grid size-8 place-items-center rounded-md font-display text-xl font-bold text-white sm:size-10 sm:text-2xl"
              style={
                {
                  "--i": i * 4,
                  background: `hsl(${hue} 100% ${68 - i * 3}%)`,
                  boxShadow: `0 4px 0 hsl(${hue} 70% 42%)`,
                } as CSSProperties
              }
            >
              {letter}
            </span>
          </span>
        );
      })}
    </span>
  );
}
