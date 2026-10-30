"use client";

import { useEffect, useRef, useState } from "react";
import { useBestScore } from "@/lib/storage";
import { CountdownRing } from "./CountdownRing";
import { manifest } from "./manifest";

const ROUND_MS = 10_000;
const TICK_MS = 100;

type Phase = "idle" | "running" | "done";

export default function ClickSprint() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [clicks, setClicks] = useState(0);
  const [msLeft, setMsLeft] = useState(ROUND_MS);
  const [isNewBest, setIsNewBest] = useState(false);
  const { best, submit } = useBestScore(manifest.slug);

  const clicksRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => stopTimer, []);

  const start = () => {
    stopTimer();
    clicksRef.current = 1;
    setClicks(1);
    setMsLeft(ROUND_MS);
    setIsNewBest(false);
    setPhase("running");

    const endsAt = performance.now() + ROUND_MS;
    intervalRef.current = setInterval(() => {
      const left = Math.max(0, endsAt - performance.now());
      setMsLeft(left);
      if (left === 0) {
        stopTimer();
        setPhase("done");
        setIsNewBest(submit(clicksRef.current));
      }
    }, TICK_MS);
  };

  const handleTap = () => {
    if (phase === "idle") {
      start();
    } else if (phase === "running") {
      clicksRef.current += 1;
      setClicks(clicksRef.current);
    }
  };

  const cps = (clicks / (ROUND_MS / 1000)).toFixed(1);
  const progress = msLeft / ROUND_MS;

  return (
    <div className="flex h-full w-full max-w-md flex-col items-center justify-center gap-[4dvh]">
      <div className="flex flex-wrap justify-center gap-2">
        <span className="pill">
          Time <strong>{(msLeft / 1000).toFixed(1)}</strong>s
        </span>
        <span className="pill">
          Clicks <strong>{clicks}</strong>
        </span>
        {best !== null && (
          <span className="pill">
            Best <strong>{best}</strong>
          </span>
        )}
      </div>

      <div className="relative grid size-[min(72vw,46dvh)] place-items-center">
        <CountdownRing progress={progress} />

        <button
          type="button"
          onPointerDown={handleTap}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              if (!e.repeat) handleTap();
            }
          }}
          disabled={phase === "done"}
          className="font-display size-[88%] touch-manipulation rounded-full bg-accent text-3xl font-bold text-white shadow-[0_8px_0_rgb(0_0_0/0.18)] transition-transform select-none active:translate-y-1 active:shadow-[0_4px_0_rgb(0_0_0/0.18)] disabled:opacity-40 sm:text-4xl"
        >
          {phase === "idle" && "Start"}
          {phase === "running" && "Click!"}
          {phase === "done" && "Time!"}
        </button>
      </div>

      <div className="flex min-h-24 flex-col items-center gap-3 text-center">
        {phase === "idle" && (
          <p className="max-w-64 text-sm text-ink-muted">
            The clock starts on your first click. You get ten seconds.
          </p>
        )}
        {phase === "done" && (
          <>
            <p className="font-display text-2xl font-bold">
              {isNewBest ? "New best! " : ""}
              {clicks} {clicks === 1 ? "click" : "clicks"} · {cps}/s
            </p>
            <button type="button" onClick={start} className="btn">
              Play again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
