"use client";

import { useMemo, useState } from "react";

const TOTAL_ROUNDS = 10;
const SWATCH_COUNT = 6;

type Phase = "idle" | "playing" | "done";

function randomHsl(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 65 + Math.floor(Math.random() * 20);
  const lightness = 45 + Math.floor(Math.random() * 15);
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function buildRound(): { target: string; options: string[] } {
  const target = randomHsl();
  const options = [target];
  while (options.length < SWATCH_COUNT) {
    options.push(randomHsl());
  }
  // Shuffle in place.
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { target, options };
}

export default function ColorMatch() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(() => buildRound());
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const start = () => {
    setPhase("playing");
    setRound(1);
    setScore(0);
    setCurrent(buildRound());
    setFeedback(null);
  };

  const pick = (color: string) => {
    if (phase !== "playing" || feedback) return;

    if (color !== current.target) {
      setFeedback("wrong");
      window.setTimeout(() => setPhase("done"), 400);
      return;
    }

    setFeedback("correct");
    window.setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        setScore((s) => s + 1);
        setPhase("done");
        return;
      }
      setScore((s) => s + 1);
      setRound((r) => r + 1);
      setCurrent(buildRound());
      setFeedback(null);
    }, 250);
  };

  const gridCols = useMemo(() => {
    return SWATCH_COUNT % 3 === 0 ? "grid-cols-3" : "grid-cols-2";
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {phase === "idle" && (
        <button
          type="button"
          onClick={start}
          className="rounded-full bg-[var(--game-accent)] px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
        >
          Start
        </button>
      )}

      {phase !== "idle" && (
        <div className="font-mono text-sm text-neutral-500">
          Round {Math.min(round, TOTAL_ROUNDS)}/{TOTAL_ROUNDS} · Score {score}
        </div>
      )}

      {phase === "playing" && (
        <>
          <p className="text-sm text-neutral-500">Find this color:</p>
          <div
            className="h-20 w-40 rounded-xl border border-black/10 shadow-inner"
            style={{ background: current.target }}
          />
          <div className={`grid ${gridCols} gap-3`}>
            {current.options.map((color, i) => (
              <button
                key={`${color}-${i}`}
                type="button"
                onClick={() => pick(color)}
                className="h-16 w-16 rounded-lg border border-black/10 transition-transform hover:scale-105 active:scale-95 sm:h-20 sm:w-20"
                style={{ background: color }}
                aria-label={`Swatch ${i + 1}`}
              />
            ))}
          </div>
          {feedback === "wrong" && (
            <p className="font-semibold text-red-500">Not quite!</p>
          )}
        </>
      )}

      {phase === "done" && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">
            You matched {score} of {TOTAL_ROUNDS}
          </p>
          <button
            type="button"
            onClick={start}
            className="rounded-full border border-current px-5 py-2 text-sm font-medium transition-opacity hover:opacity-70"
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
