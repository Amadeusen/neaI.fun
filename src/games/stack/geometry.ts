import { project, type Point } from "./projection";
import { BLOCK_HEIGHT, CENTER, MIN_OVERLAP } from "./constants";
import type { Axis, Block } from "./types";

export interface BlockFaces {
  top: Point[];
  right: Point[];
  left: Point[];
}

/** Projects a block's three visible faces (top, right, left) at a given z-range. */
export function faces(block: Block, z0: number, z1: number): BlockFaces {
  const x0 = block.x - CENTER;
  const x1 = block.x + block.width - CENTER;
  const y0 = block.y - CENTER;
  const y1 = block.y + block.depth - CENTER;

  const b = project(x1, y0, z0);
  const c = project(x1, y1, z0);
  const d = project(x0, y1, z0);
  const e = project(x0, y0, z1);
  const f = project(x1, y0, z1);
  const g = project(x1, y1, z1);
  const h = project(x0, y1, z1);

  return {
    top: [e, f, g, h],
    right: [b, f, g, c],
    left: [c, d, h, g],
  };
}

/** All projected corner points of a block sitting at layer `index`. */
export function blockPoints(block: Block, index: number): Point[] {
  const z0 = index * BLOCK_HEIGHT;
  const z1 = z0 + BLOCK_HEIGHT;
  const f = faces(block, z0, z1);
  return [...f.top, ...f.right, ...f.left];
}

/**
 * Drops `moving` onto `top` along `axis`. Returns the part that lands (the
 * overlap) and the trimmed-off pieces, or null when the overlap is too thin
 * to count as a hit.
 */
export function sliceBlock(
  moving: Block,
  top: Block,
  axis: Axis,
): { placed: Block; pieces: Block[] } | null {
  const pos = axis === "x" ? "x" : "y";
  const len = axis === "x" ? "width" : "depth";

  const start = Math.max(moving[pos], top[pos]);
  const end = Math.min(moving[pos] + moving[len], top[pos] + top[len]);
  const overlap = end - start;
  if (overlap <= MIN_OVERLAP) return null;

  const pieces: Block[] = [];
  if (moving[pos] < start) {
    pieces.push({ ...moving, [pos]: moving[pos], [len]: start - moving[pos] });
  }
  const movingEnd = moving[pos] + moving[len];
  if (movingEnd > end) {
    pieces.push({ ...moving, [pos]: end, [len]: movingEnd - end });
  }

  return { placed: { ...top, [pos]: start, [len]: overlap }, pieces };
}

/** Screen-space center of a block sitting at layer `index` (for fall-direction math). */
export function blockScreenCenter(block: Block, index: number): Point {
  return project(
    block.x + block.width / 2 - CENTER,
    block.y + block.depth / 2 - CENTER,
    index * BLOCK_HEIGHT + BLOCK_HEIGHT / 2,
  );
}
