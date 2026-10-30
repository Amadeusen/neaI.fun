import { BASE_SIZE, GAME_SIZE } from "./constants";
import type { Axis, Block } from "./types";

/** The square starting block, centered in the play area. */
export function baseBlock(): Block {
  const offset = (GAME_SIZE - BASE_SIZE) / 2;
  return { x: offset, y: offset, width: BASE_SIZE, depth: BASE_SIZE };
}

/** Layers alternate sliding axes: odd layers move along x, even along y. */
export function axisForIndex(index: number): Axis {
  return index % 2 === 1 ? "x" : "y";
}

/**
 * The next sliding block for layer `index`: same footprint as `prev`, placed
 * at one end of its axis and heading toward the other (`dir`).
 */
export function nextSlidingBlock(prev: Block, index: number, dir: 1 | -1) {
  const axis = axisForIndex(index);
  const size = axis === "x" ? prev.width : prev.depth;
  const pos = dir === 1 ? 0 : GAME_SIZE - size;
  const block: Block =
    axis === "x"
      ? { x: pos, y: prev.y, width: size, depth: prev.depth }
      : { x: prev.x, y: pos, width: prev.width, depth: size };
  return { block, axis, size, pos };
}
