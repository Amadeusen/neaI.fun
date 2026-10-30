import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { Round } from "./rounds";

/**
 * The grid of swatches to pick from. It stays square-celled and sizes itself
 * to the screen: never wider than the viewport, never taller than
 * `--grid-h` (set by the parent), whatever the number of rows and columns.
 */
export function SwatchGrid({
  round,
  picked,
  onPick,
}: {
  round: Round;
  /** Index of the picked swatch, or null while the player is choosing. */
  picked: number | null;
  onPick: (index: number) => void;
}) {
  const dense = round.cols > 4;
  const style = {
    gridTemplateColumns: `repeat(${round.cols}, minmax(0, 1fr))`,
    width: `min(86vw, 26rem, calc(var(--grid-h) * ${round.cols / round.rows}))`,
  } as CSSProperties;

  return (
    <div className={cn("grid", dense ? "gap-1.5" : "gap-3")} style={style}>
      {round.options.map((color, i) => {
        const isTarget = color === round.target;
        const reveal = picked !== null && isTarget;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            aria-label={`Swatch ${i + 1}`}
            className={cn(
              "aspect-square w-full transition-transform active:translate-y-0.5",
              dense
                ? "rounded-md shadow-[0_2px_0_rgb(0_0_0/0.15)]"
                : "rounded-[var(--radius-tile)] shadow-[0_4px_0_rgb(0_0_0/0.15)]",
              picked === null && "hover:-translate-y-0.5",
              reveal && "relative z-10 ring-4 ring-ink ring-offset-2 ring-offset-screen",
              picked === i && !isTarget && "opacity-40",
            )}
            style={{ background: color }}
          />
        );
      })}
    </div>
  );
}
