import type { Phase } from "./types";

/**
 * Everything drawn over the scene: the big score, the best-score pill, and
 * the "tap to start" / "game over" overlays.
 */
export function StackHud({
  phase,
  score,
  best,
  isNewBest,
  onRestart,
}: {
  phase: Phase;
  score: number;
  best: number | null;
  isNewBest: boolean;
  onRestart: () => void;
}) {
  return (
    <>
      {phase !== "idle" && (
        <span className="pointer-events-none absolute inset-x-0 top-6 text-center font-display text-7xl leading-none font-bold text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.25)]">
          {score}
        </span>
      )}

      {best !== null && (
        <span className="pill absolute top-3 right-3">
          Best <strong>{best}</strong>
        </span>
      )}

      {phase === "idle" && (
        <div className="overlay">
          <span className="btn">Tap to start</span>
          <p className="pill">Drop each block right on top of the last one</p>
        </div>
      )}

      {phase === "over" && (
        <div className="overlay overlay-dim">
          <p className="font-display text-3xl font-bold">
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
        Click, tap or press space
      </p>
    </>
  );
}
