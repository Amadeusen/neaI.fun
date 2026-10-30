import { useRef, useState } from "react";
import { haptics } from "@/lib/haptics";
import { sfx } from "@/lib/sfx";
import { useBestScore } from "@/lib/storage";
import { useCountdown } from "@/lib/useCountdown";
import { useTimeouts } from "@/lib/useTimeouts";
import { manifest } from "./manifest";

export const ROUND_MS = 10_000;
/** The clock ticks audibly during the last this-many seconds. */
const URGENT_SECONDS = 3;

export type Phase = "idle" | "running" | "done";

/**
 * Click Sprint's state: a ten-second round started by the first tap, the
 * click count, the countdown, the best score, and the sounds that go with
 * them.
 */
export function useClickSprint() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [clicks, setClicks] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const { best, submit } = useBestScore(manifest.slug);
  const clock = useCountdown();
  const later = useTimeouts();

  const clicksRef = useRef(0);
  const lastSecondRef = useRef(ROUND_MS / 1000);

  const finish = () => {
    setPhase("done");
    sfx.timeUp();
    haptics.heavy();
    const newBest = submit(clicksRef.current);
    setIsNewBest(newBest);
    if (newBest) later(sfx.newBest, 550);
  };

  /** Ticks once per second during the last URGENT_SECONDS. */
  const tickLastSeconds = (msLeft: number) => {
    const second = Math.ceil(msLeft / 1000);
    if (second >= lastSecondRef.current) return;
    lastSecondRef.current = second;
    if (second > 0 && second <= URGENT_SECONDS) sfx.tick();
  };

  const start = () => {
    clicksRef.current = 1;
    lastSecondRef.current = ROUND_MS / 1000;
    setClicks(1);
    setIsNewBest(false);
    setPhase("running");
    sfx.start();
    haptics.light();
    clock.start(ROUND_MS, { onTick: tickLastSeconds, onEnd: finish });
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

  const msLeft = phase === "idle" ? ROUND_MS : clock.msLeft;

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
