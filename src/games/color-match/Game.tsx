"use client";

import { useState } from "react";
import { useBestScore } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { manifest } from "./manifest";
import { buildRound, HARD_FROM, isNewGridLevel, type Phase, type Round } from "./rounds";
import { SwatchGrid } from "./SwatchGrid";

/**
 * Color Match: an endless run of levels. Pick the swatch matching the target;
 * one wrong pick ends the run. The score is the number of levels cleared.
 * Level rules and color generation live in rounds.ts.
 */
export default function ColorMatch() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState<Round | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const { best, submit } = useBestScore(manifest.slug);

  const goTo = (next: number) => {
    setLevel(next);
    setRound(buildRound(next));
    setPicked(null);
  };

  const start = () => {
    goTo(1);
    setIsNewBest(false);
    setPhase("playing");
  };

  const pick = (index: number) => {
    if (phase !== "playing" || !round || picked !== null) return;
    setPicked(index);

    if (round.options[index] !== round.target) {
      const cleared = level - 1;
      window.setTimeout(() => {
        setPhase("done");
        setIsNewBest(submit(cleared));
      }, 1100);
      return;
    }
    window.setTimeout(() => goTo(level + 1), 280);
  };

  const wrong = picked !== null && round !== null && round.options[picked] !== round.target;
  const cleared = level - 1;

  let message = "";
  if (wrong) message = "Not quite! That was the one.";
  else if (picked === null && level === HARD_FROM) message = "Now it gets tricky…";
  else if (picked === null && isNewGridLevel(level)) message = "Bigger grid!";

  return (
    <div className="flex h-full w-full max-w-xl flex-col items-center justify-center gap-[2.5dvh] text-center">
      <div className="flex flex-wrap justify-center gap-2">
        {phase === "playing" && (
          <span className="pill">
            Level <strong>{level}</strong>
          </span>
        )}
        {best !== null && (
          <span className="pill">
            Best <strong>{best}</strong>
          </span>
        )}
      </div>

      {phase === "idle" && (
        <div className="flex flex-col items-center gap-5">
          <span className="text-7xl" aria-hidden>
            {manifest.emoji}
          </span>
          <p className="max-w-72 text-ink-muted">
            Find the matching color. From level {HARD_FROM} the grid grows and the shades get
            closer and closer. One wrong pick ends the run.
          </p>
          <button type="button" onClick={start} className="btn">
            Start
          </button>
        </div>
      )}

      {phase === "playing" && round && (
        <div className="flex flex-col items-center gap-[2.5dvh] [--grid-h:46dvh] [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:[--grid-h:66dvh]">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-ink-muted">Find this color</p>
            <div
              className={cn(
                "h-[min(13dvh,6rem)] w-[min(60vw,14rem)] rounded-[var(--radius-card)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]",
                wrong && "shake",
              )}
              style={{ background: round.target }}
            />
          </div>
          <SwatchGrid round={round} picked={picked} onPick={pick} />
        </div>
      )}

      {phase === "playing" && (
        <p className="h-6 font-semibold" aria-live="polite">
          {message}
        </p>
      )}

      {phase === "done" && (
        <div className="flex flex-col items-center gap-4">
          <p className="font-display text-3xl font-bold">{isNewBest ? "New best!" : "Run over"}</p>
          <p className="text-ink-muted">
            You cleared {cleared} {cleared === 1 ? "level" : "levels"}
          </p>
          <button type="button" onClick={start} className="btn">
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
