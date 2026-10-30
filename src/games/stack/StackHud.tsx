import { Confetti } from "@/components/game/Confetti";
import type { Phase } from "./types";
import type { DropEvent } from "./useStackGame";

/** The floating word shown after a special drop. */
function dropLabel(drop: DropEvent): string | null {
  if (drop.kind === "grow") return "Grow!";
  if (drop.kind === "perfect") return drop.streak > 1 ? `Perfect ×${drop.streak}` : "Perfect!";
  return null;
}

/**
 * Everything drawn over the scene: the big score (bumps on every drop),
 * "Perfect!" popups, the best-score pill, and the "tap to start" /
 * "game over" overlays (with confetti on a new best).
 */
export function StackHud({
  phase,
  score,
  best,
  isNewBest,
  lastDrop,
  onRestart,
}: {
  phase: Phase;
  score: number;
  best: number | null;
  isNewBest: boolean;
  lastDrop: DropEvent | null;
  onRestart: () => void;
}) {
  const label = phase === "playing" && lastDrop ? dropLabel(lastDrop) : null;

  return (
    <>
      {phase !== "idle" && (
        <span
          key={score}
          className="bump pointer-events-none absolute inset-x-0 top-6 text-center font-display text-7xl leading-none font-bold text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.25)]"
        >
          {score}
        </span>
      )}

      {label && lastDrop && (
        <span
          key={lastDrop.id}
          className="float-up pointer-events-none absolute top-28 left-1/2 font-display text-3xl font-bold whitespace-nowrap text-white drop-shadow-[0_2px_4px_rgb(0_0_0/0.3)]"
        >
          {label}
        </span>
      )}

      {best !== null && (
        <span className="pill absolute top-3 right-3">
          Best <strong>{best}</strong>
        </span>
      )}

      {phase === "idle" && (
        <div className="overlay">
          <span className="btn bob">Tap to start</span>
          <p className="pill">Drop each block right on top of the last one</p>
        </div>
      )}

      {phase === "over" && (
        <div className="overlay overlay-dim">
          {isNewBest && <Confetti />}
          <p className="pop font-display text-4xl font-bold">
            {isNewBest ? "New best!" : "Tower down"}
          </p>
          <p className="text-white/80">
            {score} {score === 1 ? "block" : "blocks"} high
          </p>
          <button
            type="button"
            // Keep the stage's own pointer handler from seeing this press.
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onRestart}
            className="btn btn-light mt-2"
          >
            Try again
          </button>
        </div>
      )}

      <p className="pointer-events-none absolute inset-x-0 bottom-3 hidden text-center text-xs text-ink/50 sm:block">
        Click, tap or press space · land 3 perfect drops in a row to grow back
      </p>
    </>
  );
}
