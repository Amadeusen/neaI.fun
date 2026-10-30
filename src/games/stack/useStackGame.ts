import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useBestScore } from "@/lib/storage";
import { BASE_SIZE, BASE_SPEED, GAME_SIZE, MAX_SPEED, SPEED_STEP } from "./constants";
import { sliceBlock } from "./geometry";
import { manifest } from "./manifest";
import { baseBlock, nextSlidingBlock } from "./rules";
import { useDebris } from "./useDebris";
import type { Axis, Block, Phase } from "./types";

/**
 * All of Stack's game state and rules: the animation loop that slides the
 * current block, dropping it, scoring and restarting. Rendering lives in
 * Game.tsx and its children; this hook knows nothing about SVG.
 */
export function useStackGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [blocks, setBlocks] = useState<Block[]>(() => [baseBlock()]);
  const [current, setCurrent] = useState<Block | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const { debris, spawnDebris, clearDebris } = useDebris();
  const { best, submit } = useBestScore(manifest.slug);

  // The animation loop and input handlers read and write these refs directly,
  // so a drop always uses the block's exact position, even between renders.
  const blocksRef = useRef<Block[]>(blocks);
  const blockRef = useRef<Block>(blocks[0]);
  const axisRef = useRef<Axis>("x");
  const dirRef = useRef<1 | -1>(1);
  const speedRef = useRef(BASE_SPEED);
  const posRef = useRef(0);
  const sizeRef = useRef(BASE_SIZE);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const stopLoop = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTsRef.current = null;
  };

  useEffect(() => stopLoop, []);

  const placeBlocks = (next: Block[]) => {
    blocksRef.current = next;
    setBlocks(next);
  };

  const spawnNext = (prev: Block, index: number) => {
    const dir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
    const next = nextSlidingBlock(prev, index, dir);
    axisRef.current = next.axis;
    dirRef.current = dir;
    sizeRef.current = next.size;
    posRef.current = next.pos;
    blockRef.current = next.block;
    setCurrent(next.block);
  };

  /** One animation frame: move the sliding block, bouncing at the edges. */
  const tick = (ts: number) => {
    if (lastTsRef.current == null) lastTsRef.current = ts;
    const dt = (ts - lastTsRef.current) / 1000;
    lastTsRef.current = ts;

    let pos = posRef.current + dirRef.current * speedRef.current * dt;
    const maxPos = GAME_SIZE - sizeRef.current;
    if (pos <= 0) {
      pos = 0;
      dirRef.current = 1;
    } else if (pos >= maxPos) {
      pos = maxPos;
      dirRef.current = -1;
    }
    posRef.current = pos;

    const prev = blockRef.current;
    const block: Block = axisRef.current === "x" ? { ...prev, x: pos } : { ...prev, y: pos };
    blockRef.current = block;
    setCurrent(block);
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    stopLoop();
    clearDebris();
    const base = baseBlock();
    placeBlocks([base]);
    speedRef.current = BASE_SPEED;
    setIsNewBest(false);
    spawnNext(base, 1);
    setPhase("playing");
    rafRef.current = requestAnimationFrame(tick);
  };

  const drop = () => {
    const placed = blocksRef.current;
    const result = sliceBlock(blockRef.current, placed[placed.length - 1], axisRef.current);

    if (!result) {
      stopLoop();
      setCurrent(null);
      setPhase("over");
      setIsNewBest(submit(placed.length - 1));
      return;
    }

    spawnDebris(result.pieces, placed.length);
    placeBlocks([...placed, result.placed]);
    speedRef.current = Math.min(MAX_SPEED, speedRef.current + SPEED_STEP);
    spawnNext(result.placed, placed.length + 1);
  };

  /** Tap / click: starts a run when idle, drops the block while playing. */
  const activate = () => {
    if (phase === "idle") start();
    else if (phase === "playing") drop();
  };

  // Space bar works from anywhere on the page, no need to focus the stage.
  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key !== " " || e.repeat) return;
    e.preventDefault();
    if (phase === "over") start();
    else activate();
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return {
    phase,
    blocks,
    current,
    debris,
    score: Math.max(0, blocks.length - 1),
    best,
    isNewBest,
    start,
    activate,
  };
}
