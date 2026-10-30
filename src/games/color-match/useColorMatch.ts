import { useRef, useState } from "react";
import { haptics } from "@/lib/haptics";
import { sfx } from "@/lib/sfx";
import { useBestScore } from "@/lib/storage";
import { useCountdown } from "@/lib/useCountdown";
import { useTimeouts } from "@/lib/useTimeouts";
import { manifest } from "./manifest";
import { buildRound, isNewGridLevel, type Phase, type Round } from "./rounds";

export const START_MS = 30_000;
export const BONUS_MS = 5_000;
export const LIVES = 3;
/** Under this much time left, the clock turns urgent. */
export const URGENT_MS = 5_000;
/** How long the answer stays revealed before the results screen. */
const GAME_OVER_DELAY_MS = 1200;
/** Pause on a right pick before the next level appears. */
const NEXT_LEVEL_DELAY_MS = 300;

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
  const [cleared, setCleared] = useState(0);
  const [round, setRound] = useState<Round | null>(null);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [solved, setSolved] = useState<number | null>(null);
  const [lives, setLives] = useState(LIVES);
  const [bonusId, setBonusId] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const { best, submit } = useBestScore(manifest.slug);
  const clock = useCountdown();
  const later = useTimeouts();

  const clearedRef = useRef(0);
  const overRef = useRef(false);

  const goTo = (next: number) => {
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
    clock.stop();
    setPhase("reveal");
    sfx.fail();
    haptics.heavy();
    later(() => {
      setPhase("done");
      const newBest = submit(clearedRef.current);
      setIsNewBest(newBest);
      if (newBest) sfx.newBest();
    }, GAME_OVER_DELAY_MS);
  };

  const start = () => {
    overRef.current = false;
    clearedRef.current = 0;
    setCleared(0);
    goTo(1);
    setLives(LIVES);
    setBonusId(0);
    setIsNewBest(false);
    setPhase("playing");
    sfx.start();
    clock.start(START_MS, { onEnd: gameOver });
  };

  const pick = (index: number) => {
    if (phase !== "playing" || !round || solved !== null || wrongPicks.includes(index)) return;

    if (round.options[index] === round.target) {
      clearedRef.current += 1;
      setCleared(clearedRef.current);
      setSolved(index);
      clock.add(BONUS_MS);
      setBonusId((id) => id + 1);
      sfx.success(level);
      haptics.light();
      // The clock may run out during the pause: then the run is over.
      later(() => !overRef.current && goTo(level + 1), NEXT_LEVEL_DELAY_MS);
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
    cleared,
    round,
    wrongPicks,
    solved,
    lives,
    msLeft: phase === "idle" ? START_MS : clock.msLeft,
    bonusId,
    best,
    isNewBest,
    start,
    pick,
  };
}
