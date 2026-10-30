import { blockPoints } from "./geometry";
import { VIEW_PAD, VIEW_W } from "./constants";
import type { Block } from "./types";

/**
 * The SVG viewBox that frames the tower on a stage of the given aspect ratio.
 *
 * Framing is derived only from placed blocks (never the live, oscillating
 * block) so the camera holds still while a piece is in flight and only
 * resettles when a block actually lands. `topIndex` is the highest layer to
 * keep in view: the in-flight layer while playing, the last placed otherwise.
 * While the tower is short it is centered vertically; once it is taller than
 * the view, the camera follows the top.
 */
export function cameraViewBox(blocks: Block[], topIndex: number, aspect: number): string {
  const viewH = VIEW_W / aspect;

  const lastPlaced = blocks[blocks.length - 1];
  const topY = Math.min(...blockPoints(lastPlaced, topIndex).map((p) => p[1]));
  const baseBottomY = Math.max(...blockPoints(blocks[0], 0).map((p) => p[1]));

  const naturalMinY = topY - VIEW_PAD;
  const naturalHeight = baseBottomY + VIEW_PAD - naturalMinY;
  const viewMinY =
    naturalHeight <= viewH ? naturalMinY - (viewH - naturalHeight) / 2 : naturalMinY;

  return `${-VIEW_W / 2} ${viewMinY} ${VIEW_W} ${viewH}`;
}
