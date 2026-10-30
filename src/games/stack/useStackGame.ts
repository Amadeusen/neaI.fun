import { useRef, useState } from "react";
import { sfx } from "@/lib/sfx";
import { useBestScore } from "@/lib/storage";
import { useKeyPress } from "@/lib/useKeyPress";
import { dropFeedback } from "./feedback";
import { manifest } from "./manifest";
import { baseBlock, resolveDrop } from "./rules";
import { useDebris } from "./useDebris";
import { useSlidingBlock } from "./useSlidingBlock";
import type { Block, Phase } from "./types";

/** Space presses right after losing are ignored, so mashing doesn't skip the result. */
const RESTART_LOCK_MS = 700;

/** The latest drop, for one-shot effects; `id` changes on every drop. */
export interface DropEvent {
  id: number;
  kind: "place" | "perfect" | "grow";
  streak: number;
}

/**
 * Stack's game state and rules: starting, dropping (normal, perfect, grow,
 * miss), scoring and restarting, plus sound and vibration. The sliding
 * motion lives in useSlidingBlock; rendering lives in Game.tsx's children.
 */
export function useStackGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [blocks, setBlocks] = useState<Block[]>(() => [baseBlock()]);
  const [isNewBest, setIsNewBest] = useState(false);
  const [lastDrop, setLastDrop] = useState<DropEvent | null>(null);
  const slider = useSlidingBlock();
  const { debris, spawnDebris, clearDebris } = useDebris();
  const { best, submit } = useBestScore(manifest.slug);

  const blocksRef = useRef<Block[]>(blocks);
  const streakRef = useRef(0);
  const historyRef = useRef<Block[]>([]);
  const overAtRef = useRef(0);
  const dropId = useRef(0);

  const placeBlocks = (next: Block[]) => {
    blocksRef.current = next;
    setBlocks(next);
  };

  const start = () => {
    clearDebris();
    const base = baseBlock();
    placeBlocks([base]);
    streakRef.current = 0;
    historyRef.current = [];
    setIsNewBest(false);
    setLastDrop(null);
    slider.spawn(base, 1);
    slider.run();
    setPhase("playing");
    sfx.start();
  };

  const lose = (score: number) => {
    slider.hide();
    setPhase("over");
    overAtRef.current = performance.now();
    dropFeedback("miss", score, 0);
    const newBest = submit(score);
    setIsNewBest(newBest);
    if (newBest) window.setTimeout(sfx.newBest, 450);
  };

  const drop = () => {
    const placed = blocksRef.current;
    const moving = slider.blockRef.current;
    if (!moving) return;
    const top = placed[placed.length - 1];
    const outcome = resolveDrop(moving, top, slider.axisRef.current, streakRef.current, historyRef.current);

    if (outcome.kind === "miss") {
      lose(placed.length - 1);
      return;
    }

    streakRef.current = outcome.streak;
    historyRef.current = outcome.history;
    spawnDebris(outcome.pieces, placed.length);
    placeBlocks([...placed, outcome.placed]);
    setLastDrop({ id: dropId.current++, kind: outcome.kind, streak: outcome.streak });
    dropFeedback(outcome.kind, placed.length, outcome.streak);
    slider.speedUp();
    slider.spawn(outcome.placed, placed.length + 1);
  };

  /** Tap / click: starts a run when idle, drops the block while playing. */
  const activate = () => {
    if (phase === "idle") start();
    else if (phase === "playing") drop();
  };

  // Space bar works from anywhere on the page, no need to focus the stage.
  useKeyPress(" ", () => {
    if (phase !== "over") activate();
    else if (performance.now() - overAtRef.current > RESTART_LOCK_MS) start();
  });

  return {
    phase,
    blocks,
    current: slider.current,
    debris,
    lastDrop,
    score: Math.max(0, blocks.length - 1),
    best,
    isNewBest,
    start,
    activate,
  };
}
