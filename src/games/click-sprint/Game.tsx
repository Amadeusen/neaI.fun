"use client";

import { Confetti } from "@/components/game/Confetti";
import { SprintButton } from "./SprintButton";
import { ROUND_MS, useClickSprint } from "./useClickSprint";

/**
 * Click Sprint: as many clicks as possible in ten seconds. The rules live in
 * useClickSprint; the button (which doubles as the scoreboard) in
 * SprintButton.
 */
export default function ClickSprint() {
  const game = useClickSprint();
  const cps = (game.clicks / (ROUND_MS / 1000)).toFixed(1);
  const elapsed = (ROUND_MS - game.msLeft) / 1000;
  const liveCps = (game.clicks / Math.max(elapsed, 0.5)).toFixed(1);

  return (
    <div className="relative flex h-full w-full max-w-md flex-col items-center justify-center gap-[3dvh]">
      <SprintButton
        phase={game.phase}
        clicks={game.clicks}
        msLeft={game.msLeft}
        best={game.best}
        urgent={game.urgent}
        onTap={game.tap}
      />

      <div className="flex min-h-28 flex-col items-center gap-3 text-center">
        {game.phase === "idle" && (
          <p className="max-w-64 text-sm text-ink-muted">
            The clock starts on your first tap. Ten seconds. Go wild.
          </p>
        )}
        {game.phase === "running" && (
          <p className="text-sm text-ink-muted tabular-nums">{liveCps} clicks per second</p>
        )}
        {game.phase === "done" && (
          <>
            {game.isNewBest && <Confetti />}
            <p className="pop font-display text-3xl font-bold">
              {game.isNewBest ? "New best!" : `${cps} per second`}
            </p>
            <button type="button" onClick={game.start} className="btn">
              Play again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
