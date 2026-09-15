"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ROUND_SECONDS = 10;

type Phase = "idle" | "running" | "done";

export default function ClickSprint() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => stopTimer, [stopTimer]);

  const start = () => {
    stopTimer();
    setPhase("running");
    setClicks(1);
    setTimeLeft(ROUND_SECONDS);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          setPhase("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTap = () => {
    if (phase === "idle") {
      start();
      return;
    }
    if (phase === "running") {
      setClicks((c) => c + 1);
    }
  };

  const reset = () => {
    stopTimer();
    setPhase("idle");
    setClicks(0);
    setTimeLeft(ROUND_SECONDS);
  };

  const cps = (clicks / ROUND_SECONDS).toFixed(1);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex items-baseline gap-8 font-mono text-lg">
        <span>
          Time: <strong className="text-2xl">{timeLeft}</strong>s
        </span>
        <span>
          Clicks: <strong className="text-2xl">{clicks}</strong>
        </span>
      </div>

      <button
        type="button"
        onClick={handleTap}
        disabled={phase === "done"}
        className="flex h-56 w-56 select-none items-center justify-center rounded-full bg-[var(--game-accent)] text-2xl font-bold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-40 sm:h-64 sm:w-64"
      >
        {phase === "idle" && "Start"}
        {phase === "running" && "Click!"}
        {phase === "done" && "Time!"}
      </button>

      {phase === "done" && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">
            {clicks} clicks — {cps} clicks/sec
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-current px-5 py-2 text-sm font-medium transition-opacity hover:opacity-70"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
