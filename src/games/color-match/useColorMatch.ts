import { useEffect, useRef, useState } from "react";
import { haptics } from "@/lib/haptics";
import { sfx } from "@/lib/sfx";
import { useBestScore } from "@/lib/storage";
import { manifest } from "./manifest";
import { buildRound, isNewGridLevel, type Phase, type Round } from "./rounds";

export const START_MS = 30_000;
export const BONUS_MS = 5_000;
export const LIVES = 3;
/** Under this much time left, the clock turns urgent. */
export const URGENT_MS = 5_000;
const TICK_MS = 100;
/** How long the answer stays revealed before the results screen. */
const GAME_OVER_DELAY_MS = 1200;

/**
 * Color Match's state: endless levels against a clock. The run starts with
 * START_MS on the clock; every right pick adds BONUS_MS and moves to the next
 * level. A wrong pick costs one of LIVES hearts and greys that swatch out,
 * and the player tries the same grid again. The run ends when the hearts or
 * the clock run out; the score is the number of levels cleared.
 */
export function useColorMatch() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState<Round | null>(null);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [solved, setSolved] = useState<number | null>(null);
  const [lives, setLives] = useState(LIVES);
  const [msLeft, setMsLeft] = useState(START_MS);
  const [bonusId, setBonusId] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const { best, submit } = useBestScore(manifest.slug);

  const endsAtRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const levelRef = useRef(1);
  const overRef = useRef(false);

  const stopClock = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => stopClock, []);

  const goTo = (next: number) => {
    levelRef.current = next;
    setLevel(next);
    setRound(buildRound(next));
    setWrongPicks([]);
    setSolved(null);
    if (isNewGridLevel(next)) sfx.levelUp();
  };

  /** Ends the run: shows the answer briefly, then the results. */
  const gameOver = () => {
    if (overRef.current) return;
    overRef.current = true;
    stopClock();
    setPhase("reveal");
    sfx.fail();
    haptics.heavy();
    window.setTimeout(() => {
      setPhase("done");
      const newBest = submit(levelRef.current - 1);
      setIsNewBest(newBest);
      if (newBest) sfx.newBest();
    }, GAME_OVER_DELAY_MS);
  };

  const start = () => {
    stopClock();
    overRef.current = false;
    goTo(1);
    setLives(LIVES);
    setBonusId(0);
    setIsNewBest(false);
    setPhase("playing");
    sfx.start();

    endsAtRef.current = performance.now() + START_MS;
    setMsLeft(START_MS);
    intervalRef.current = setInterval(() => {
      const left = Math.max(0, endsAtRef.current - performance.now());
      setMsLeft(left);
      if (left === 0) gameOver();
    }, TICK_MS);
  };

  const pick = (index: number) => {
    if (phase !== "playing" || !round || solved !== null || wrongPicks.includes(index)) return;

    if (round.options[index] === round.target) {
      setSolved(index);
      endsAtRef.current += BONUS_MS;
      setBonusId((id) => id + 1);
      sfx.success(level);
      haptics.light();
      window.setTimeout(() => goTo(level + 1), 300);
      return;
    }

    setWrongPicks((w) => [...w, index]);
    const remaining = lives - 1;
    setLives(remaining);
    if (remaining === 0) {
      gameOver();
    } else {
      sfx.fail();
      haptics.medium();
    }
  };

  return {
    phase,
    level,
    round,
    wrongPicks,
    solved,
    lives,
    msLeft,
    bonusId,
    best,
    isNewBest,
    start,
    pick,
  };
}
