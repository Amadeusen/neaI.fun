import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const SIZE = 4;
const ODD = 9;

// A mosaic of near-identical violets with one slightly-off tile, laid out
// deterministically so the server and client render the same thing.
const TILES = Array.from({ length: SIZE * SIZE }, (_, i) => ({
  s: 68 + (((i * 5) % 3) - 1) * 4,
  l: i === ODD ? 64 : 55 + (((i * 7) % 5) - 2) * 1.5,
}));

/**
 * The start screen: a slowly color-shifting mosaic hiding one odd tile
 * (with a magnifying glass hovering over it), a title and the Start button.
 */
export function ColorMatchIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:gap-10">
      <div className="relative">
        <div className="hue-cycle grid size-[min(58vw,30dvh)] [@media(max-height:500px)]:size-[min(40vw,55dvh)] -rotate-6 grid-cols-4 gap-1.5 rounded-2xl bg-white/70 p-2 shadow-[0_10px_30px_rgb(0_0_0/0.12)]">
          {TILES.map((t, i) => (
            <span
              key={i}
              className={cn("stagger-in rounded-md", i === ODD && "ring-4 ring-white")}
              style={{ "--i": i * 2, background: `hsl(262 ${t.s}% ${t.l}%)` } as CSSProperties}
            />
          ))}
        </div>
        <span className="bob absolute right-[8%] bottom-[18%] text-5xl drop-shadow-md" aria-hidden>
          🔍
        </span>
      </div>

      <div className="flex flex-col items-center gap-5">
        <div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">How sharp are your eyes?</h2>
          <p className="mx-auto mt-2 max-w-72 text-ink-muted">
            Find the exact color before the clock runs out. Every right pick adds 5 seconds, and you have three hearts.
          </p>
        </div>
        <button type="button" onClick={onStart} className="btn px-10 text-xl">
          Start
        </button>
      </div>
    </div>
  );
}
