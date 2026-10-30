import { BLOCK_HEIGHT } from "./constants";
import { faces } from "./geometry";
import { pointsAttr } from "./projection";
import type { Block } from "./types";
import type { DropEvent } from "./useStackGame";

/**
 * One-shot SVG effects on the block that just landed: a white flash on its
 * top face, plus an expanding outline for perfect (and bigger for grow)
 * drops. Render it with `key={drop.id}` so each drop replays them.
 */
export function DropEffects({
  block,
  index,
  drop,
}: {
  block: Block;
  index: number;
  drop: DropEvent | null;
}) {
  if (!drop) return null;
  const z = index * BLOCK_HEIGHT + BLOCK_HEIGHT;
  const top = pointsAttr(faces(block, z - BLOCK_HEIGHT, z).top);
  const special = drop.kind !== "place";

  return (
    <g pointerEvents="none">
      <polygon points={top} fill="#fff" className="flash" />
      {special && (
        <polygon
          points={top}
          fill="none"
          stroke="#fff"
          strokeWidth={drop.kind === "grow" ? 5 : 3}
          className="ring-out"
        />
      )}
      {drop.kind === "grow" && (
        <polygon points={top} fill="none" stroke="#ffe08a" strokeWidth={3} className="ring-out" style={{ animationDelay: "120ms" }} />
      )}
    </g>
  );
}
