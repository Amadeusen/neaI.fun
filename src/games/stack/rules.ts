import { BASE_SIZE, GAME_SIZE, PERFECT_TOLERANCE, REGROW_EVERY } from "./constants";
import { sliceBlock } from "./geometry";
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

/** What happened when a block was dropped. */
export type DropOutcome =
  | { kind: "miss" }
  | {
      /** "place": trimmed normally; "perfect": snapped; "grow": snapped and grew back. */
      kind: "place" | "perfect" | "grow";
      placed: Block;
      /** Trimmed-off pieces (empty unless "place"). */
      pieces: Block[];
      /** Perfect drops in a row, including this one (0 after a normal place). */
      streak: number;
      /** Footprints the top had before each trim, newest last. */
      history: Block[];
    };

/**
 * Resolves dropping `moving` onto `top`. Within PERFECT_TOLERANCE of the
 * block below it snaps into place with nothing trimmed. Every REGROW_EVERY
 * perfect drops in a row, the placed block grows back to the footprint the
 * tower had before its most recent trim (if any was lost).
 */
export function resolveDrop(
  moving: Block,
  top: Block,
  axis: Axis,
  streak: number,
  history: Block[],
): DropOutcome {
  const pos = axis === "x" ? "x" : "y";

  if (Math.abs(moving[pos] - top[pos]) <= PERFECT_TOLERANCE) {
    const nextStreak = streak + 1;
    if (nextStreak % REGROW_EVERY === 0 && history.length > 0) {
      return {
        kind: "grow",
        placed: history[history.length - 1],
        pieces: [],
        streak: nextStreak,
        history: history.slice(0, -1),
      };
    }
    return { kind: "perfect", placed: { ...top }, pieces: [], streak: nextStreak, history };
  }

  const sliced = sliceBlock(moving, top, axis);
  if (!sliced) return { kind: "miss" };
  return { kind: "place", ...sliced, streak: 0, history: [...history, top] };
}
