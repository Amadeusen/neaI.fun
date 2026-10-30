"use client";

import { Confetti } from "@/components/game/Confetti";
import { cn } from "@/lib/utils";
import { Hud } from "./Hud";
import { ColorMatchIntro } from "./Intro";
import { isNewGridLevel, VARIATIONS_FROM } from "./rounds";
import { SwatchGrid } from "./SwatchGrid";
import { useColorMatch } from "./useColorMatch";

/**
 * Color Match: find the exact color, level after level, against the clock
 * and with three hearts. Rules live in useColorMatch (state) and rounds.ts
 * (levels and colors); this component lays out the screens.
 */
export default function ColorMatch() {
  const game = useColorMatch();
  const { round, level, cleared } = game;
  const inRun = game.phase === "playing" || game.phase === "reveal";

  let message = "";
  if (game.phase === "reveal") message = game.lives === 0 ? "Out of hearts!" : "Time's up!";
  else if (game.wrongPicks.length > 0 && game.solved === null) message = "Not that one, try again!";
  else if (game.solved === null && game.healedLevel === level) message = "Heart restored! ❤️";
  else if (game.solved === null && level === VARIATIONS_FROM) message = "Now the shades get closer…";
  else if (game.solved === null && isNewGridLevel(level)) message = "Bigger grid!";

  return (
    <div className="flex h-full w-full max-w-xl flex-col items-center justify-center gap-[2.5dvh] text-center">
      {inRun && (
        <Hud
          lives={game.lives}
          streak={game.streak}
          msLeft={game.msLeft}
          bonusId={game.bonusId}
          level={level}
        />
      )}
      {!inRun && game.best !== null && (
        <span className="pill">
          Best <strong>{game.best}</strong>
        </span>
      )}

      {game.phase === "idle" && <ColorMatchIntro onStart={game.start} />}

      {inRun && round && (
        <div className="flex flex-col items-center gap-[2.5dvh] [--grid-h:44dvh] [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:[--grid-h:62dvh]">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-ink-muted">Find this color</p>
            <div
              key={`${level}-${game.wrongPicks.length}`}
              className={cn(
                "h-[min(12dvh,6rem)] w-[min(60vw,14rem)] rounded-[var(--radius-card)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]",
                game.wrongPicks.length > 0 ? "shake" : "pop",
              )}
              style={{ background: round.target }}
            />
          </div>
          <SwatchGrid
            key={level}
            round={round}
            wrongPicks={game.wrongPicks}
            solved={game.solved}
            reveal={game.phase === "reveal"}
            onPick={game.pick}
          />
        </div>
      )}

      {inRun && (
        <p key={message} className="pop h-6 font-semibold" aria-live="polite">
          {message}
        </p>
      )}

      {game.phase === "done" && (
        <div className="relative flex flex-col items-center gap-4">
          {game.isNewBest && <Confetti />}
          <p className="pop font-display text-4xl font-bold">
            {game.isNewBest ? "New best!" : "Run over"}
          </p>
          <p className="text-ink-muted">
            You cleared {cleared} {cleared === 1 ? "level" : "levels"}
          </p>
          <button type="button" onClick={game.start} className="btn">
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
