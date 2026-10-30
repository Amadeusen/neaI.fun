import { useEffect, useRef, useState } from "react";
import { haptics } from "@/lib/haptics";
import { sfx } from "@/lib/sfx";
import { useBestScore } from "@/lib/storage";
import { manifest } from "./manifest";

export const ROUND_MS = 10_000;
const TICK_MS = 100;
/** The clock ticks audibly during the last this-many seconds. */
const URGENT_SECONDS = 3;

export type Phase = "idle" | "running" | "done";

/**
 * Click Sprint's state: a ten-second round started by the first tap, the
 * click count, the countdown, the best score, and the sounds that go with
 * them. The timer compares against a fixed end time, so it stays accurate
 * even if the tab lags.
 */
export function useClickSprint() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [clicks, setClicks] = useState(0);
  const [msLeft, setMsLeft] = useState(ROUND_MS);
  const [isNewBest, setIsNewBest] = useState(false);
  const { best, submit } = useBestScore(manifest.slug);

  const clicksRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSecondRef = useRef(ROUND_MS / 1000);

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => stopTimer, []);

  const finish = () => {
    stopTimer();
    setPhase("done");
    sfx.timeUp();
    haptics.heavy();
    const newBest = submit(clicksRef.current);
    setIsNewBest(newBest);
    if (newBest) window.setTimeout(sfx.newBest, 550);
  };

  const start = () => {
    stopTimer();
    clicksRef.current = 1;
    lastSecondRef.current = ROUND_MS / 1000;
    setClicks(1);
    setMsLeft(ROUND_MS);
    setIsNewBest(false);
    setPhase("running");
    sfx.start();
    haptics.light();

    const endsAt = performance.now() + ROUND_MS;
    intervalRef.current = setInterval(() => {
      const left = Math.max(0, endsAt - performance.now());
      setMsLeft(left);
      const second = Math.ceil(left / 1000);
      if (second < lastSecondRef.current) {
        lastSecondRef.current = second;
        if (second > 0 && second <= URGENT_SECONDS) sfx.tick();
      }
      if (left === 0) finish();
    }, TICK_MS);
  };

  /** One press of the big button. Returns true if it counted as a click. */
  const tap = (): boolean => {
    if (phase === "idle") {
      start();
      return true;
    }
    if (phase !== "running") return false;
    clicksRef.current += 1;
    setClicks(clicksRef.current);
    sfx.pop(clicksRef.current);
    haptics.light();
    return true;
  };

  return {
    phase,
    clicks,
    msLeft,
    best,
    isNewBest,
    urgent: phase === "running" && msLeft <= URGENT_SECONDS * 1000,
    start,
    tap,
  };
}
