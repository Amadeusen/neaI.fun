import { project, type Point } from "./projection";
import { BLOCK_HEIGHT, CENTER } from "./constants";
import type { Block } from "./types";

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

/** Screen-space center of a block sitting at layer `index` (for fall-direction math). */
export function blockScreenCenter(block: Block, index: number): Point {
  return project(
    block.x + block.width / 2 - CENTER,
    block.y + block.depth / 2 - CENTER,
    index * BLOCK_HEIGHT + BLOCK_HEIGHT / 2,
  );
}
