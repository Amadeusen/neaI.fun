"use client";

import { useState } from "react";
import { useBestScore } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { manifest } from "./manifest";
import { buildRound, TOTAL_ROUNDS, type Phase, type Round } from "./rounds";

export default function ColorMatch() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState<Round | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const { best, submit } = useBestScore(manifest.slug);

  const start = () => {
    setPhase("playing");
    setRound(1);
    setScore(0);
    setCurrent(buildRound());
    setPicked(null);
    setIsNewBest(false);
  };

  const finish = (finalScore: number) => {
    setPhase("done");
    setIsNewBest(submit(finalScore));
  };

  const pick = (color: string) => {
    if (phase !== "playing" || !current || picked) return;
    setPicked(color);

    if (color !== current.target) {
      window.setTimeout(() => finish(score), 900);
      return;
    }

    const nextScore = score + 1;
    window.setTimeout(() => {
      setScore(nextScore);
      if (round >= TOTAL_ROUNDS) {
        finish(nextScore);
        return;
      }
      setRound(round + 1);
      setCurrent(buildRound());
      setPicked(null);
    }, 280);
  };

  const wrong = picked !== null && current !== null && picked !== current.target;

  return (
    <div className="flex h-full w-full max-w-md flex-col items-center justify-center gap-[3dvh] text-center">
      <div className="flex flex-wrap justify-center gap-2">
        {phase !== "idle" && (
          <>
            <span className="pill">
              Round <strong>{Math.max(1, Math.min(round, TOTAL_ROUNDS))}</strong>/{TOTAL_ROUNDS}
            </span>
            <span className="pill">
              Score <strong>{score}</strong>
            </span>
          </>
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
          <p className="max-w-64 text-ink-muted">
            Find the matching color, ten rounds in a row. One wrong pick ends the run.
          </p>
          <button type="button" onClick={start} className="btn">
            Start
          </button>
        </div>
      )}

      {phase === "playing" && current && (
        <>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-ink-muted">Find this color</p>
            <div
              className={cn(
                "h-[min(22dvh,9rem)] w-[min(70vw,16rem)] rounded-[var(--radius-card)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]",
                wrong && "shake",
              )}
              style={{ background: current.target }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {current.options.map((color, i) => {
              const reveal = picked !== null && color === current.target;
              return (
                <button
                  key={`${color}-${i}`}
                  type="button"
                  onClick={() => pick(color)}
                  aria-label={`Swatch ${i + 1}`}
                  className={cn(
                    "size-[min(24vw,14dvh,6.5rem)] rounded-[var(--radius-tile)] shadow-[0_4px_0_rgb(0_0_0/0.15)] transition-transform active:translate-y-1 active:shadow-none",
                    picked === null && "hover:-translate-y-0.5",
                    reveal && "ring-4 ring-ink ring-offset-2 ring-offset-screen",
                    picked === color && !reveal && "opacity-40",
                  )}
                  style={{ background: color }}
                />
              );
            })}
          </div>

          <p className="h-6 font-semibold" aria-live="polite">
            {wrong && "Not quite! That was the one."}
          </p>
        </>
      )}

      {phase === "done" && (
        <div className="flex flex-col items-center gap-4">
          <p className="font-display text-3xl font-bold">
            {score === TOTAL_ROUNDS ? "Perfect eye!" : isNewBest ? "New best!" : "Run over"}
          </p>
          <p className="text-ink-muted">
            You matched {score} of {TOTAL_ROUNDS}
          </p>
          <button type="button" onClick={start} className="btn">
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
