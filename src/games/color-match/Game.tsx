"use client";

import { useState } from "react";
import { Confetti } from "@/components/game/Confetti";
import { haptics } from "@/lib/haptics";
import { sfx } from "@/lib/sfx";
import { useBestScore } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { ColorMatchIntro } from "./Intro";
import { manifest } from "./manifest";
import { buildRound, isNewGridLevel, VARIATIONS_FROM, type Phase, type Round } from "./rounds";
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
    if (isNewGridLevel(next)) sfx.levelUp();
  };

  const start = () => {
    goTo(1);
    setIsNewBest(false);
    setPhase("playing");
    sfx.start();
  };

  const pick = (index: number) => {
    if (phase !== "playing" || !round || picked !== null) return;
    setPicked(index);

    if (round.options[index] !== round.target) {
      sfx.fail();
      haptics.heavy();
      const cleared = level - 1;
      window.setTimeout(() => {
        setPhase("done");
        const newBest = submit(cleared);
        setIsNewBest(newBest);
        if (newBest) sfx.newBest();
      }, 1100);
      return;
    }
    sfx.success(level);
    haptics.light();
    window.setTimeout(() => goTo(level + 1), 300);
  };

  const wrong = picked !== null && round !== null && round.options[picked] !== round.target;
  const cleared = level - 1;

  let message = "";
  if (wrong) message = "Not quite! That was the one.";
  else if (picked === null && level === VARIATIONS_FROM) message = "Now the shades get closer…";
  else if (picked === null && isNewGridLevel(level)) message = "Bigger grid!";

  return (
    <div className="flex h-full w-full max-w-xl flex-col items-center justify-center gap-[2.5dvh] text-center">
      <div className="flex flex-wrap justify-center gap-2">
        {phase === "playing" && (
          <span key={level} className="pill bump">
            Level <strong>{level}</strong>
          </span>
        )}
        {best !== null && (
          <span className="pill">
            Best <strong>{best}</strong>
          </span>
        )}
      </div>

      {phase === "idle" && <ColorMatchIntro onStart={start} />}

      {phase === "playing" && round && (
        <div className="flex flex-col items-center gap-[2.5dvh] [--grid-h:46dvh] [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:[--grid-h:66dvh]">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-ink-muted">Find this color</p>
            <div
              key={level}
              className={cn(
                "pop h-[min(13dvh,6rem)] w-[min(60vw,14rem)] rounded-[var(--radius-card)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]",
                wrong && "shake",
              )}
              style={{ background: round.target }}
            />
          </div>
          <SwatchGrid key={level} round={round} picked={picked} onPick={pick} />
        </div>
      )}

      {phase === "playing" && (
        <p key={message} className="pop h-6 font-semibold" aria-live="polite">
          {message}
        </p>
      )}

      {phase === "done" && (
        <div className="relative flex flex-col items-center gap-4">
          {isNewBest && <Confetti />}
          <p className="pop font-display text-4xl font-bold">{isNewBest ? "New best!" : "Run over"}</p>
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
