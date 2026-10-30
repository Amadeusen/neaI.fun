import { useEffect, useRef, useState } from "react";
import { BASE_SIZE, BASE_SPEED, GAME_SIZE, MAX_SPEED, SPEED_STEP } from "./constants";
import { nextSlidingBlock } from "./rules";
import type { Axis, Block } from "./types";

/** Longest frame step simulated, so returning to a hidden tab doesn't teleport the block. */
const MAX_FRAME_S = 0.05;

/**
 * The block sliding back and forth above the tower, driven by
 * requestAnimationFrame. `blockRef` / `axisRef` always hold the exact
 * current position, so a drop never lags a frame behind; `current` is the
 * same block as React state, for rendering.
 */
export function useSlidingBlock() {
  const [current, setCurrent] = useState<Block | null>(null);

  const blockRef = useRef<Block | null>(null);
  const axisRef = useRef<Axis>("x");
  const dirRef = useRef<1 | -1>(1);
  const speedRef = useRef(BASE_SPEED);
  const posRef = useRef(0);
  const sizeRef = useRef(BASE_SIZE);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const stop = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTsRef.current = null;
  };

  useEffect(() => stop, []);

  /** One animation frame: move the block, bouncing at the edges. */
  const tick = (ts: number) => {
    if (lastTsRef.current == null) lastTsRef.current = ts;
    const dt = Math.min(MAX_FRAME_S, (ts - lastTsRef.current) / 1000);
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

    const prev = blockRef.current!;
    const block: Block = axisRef.current === "x" ? { ...prev, x: pos } : { ...prev, y: pos };
    blockRef.current = block;
    setCurrent(block);
    rafRef.current = requestAnimationFrame(tick);
  };

  /** Places a new sliding block for layer `index`, shaped like `prev`. */
  const spawn = (prev: Block, index: number) => {
    const dir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
    const next = nextSlidingBlock(prev, index, dir);
    axisRef.current = next.axis;
    dirRef.current = dir;
    sizeRef.current = next.size;
    posRef.current = next.pos;
    blockRef.current = next.block;
    setCurrent(next.block);
  };

  return {
    current,
    blockRef,
    axisRef,
    spawn,
    /** Starts (or restarts) the animation loop at base speed. */
    run: () => {
      stop();
      speedRef.current = BASE_SPEED;
      rafRef.current = requestAnimationFrame(tick);
    },
    /** Stops the loop and removes the block. */
    hide: () => {
      stop();
      setCurrent(null);
    },
    speedUp: () => {
      speedRef.current = Math.min(MAX_SPEED, speedRef.current + SPEED_STEP);
    },
  };
}
