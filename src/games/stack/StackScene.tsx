import { memo, type CSSProperties } from "react";
import { BlockMesh } from "./BlockMesh";
import { BLOCK_HEIGHT } from "./constants";
import { DropEffects } from "./DropEffects";
import { Ground } from "./Ground";
import type { Block, Debris } from "./types";
import type { DropEvent } from "./useStackGame";

/**
 * The placed blocks. Memoized: the array only changes when a block lands, so
 * the tower isn't re-rendered on every animation frame of the sliding block.
 */
const Tower = memo(function Tower({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, i) => <BlockMesh key={i} block={block} index={i} />);
});

/** The isometric world: island, placed tower, landing effects, debris and the sliding block. */
export function StackScene({
  viewBox,
  score,
  blocks,
  debris,
  current,
  lastDrop,
}: {
  viewBox: string;
  score: number;
  blocks: Block[];
  debris: Debris[];
  /** The sliding block, or null when nothing is in flight. */
  current: Block | null;
  /** The latest drop, for landing effects on the top block. */
  lastDrop: DropEvent | null;
}) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox={viewBox} aria-hidden>
      <Ground score={score} />

      <Tower blocks={blocks} />

      <DropEffects key={lastDrop?.id} block={blocks[blocks.length - 1]} index={blocks.length - 1} drop={lastDrop} />

      {debris.map((d) => (
        <g
          key={d.id}
          className="debris-fall-3d"
          style={
            {
              "--fall-x": `${d.fallX}px`,
              "--fall-y": `${d.fallY}px`,
              "--fall-rotate": `${d.fallRotate}deg`,
            } as CSSProperties
          }
        >
          <BlockMesh block={d} index={Math.round(d.bottom / BLOCK_HEIGHT)} />
        </g>
      ))}

      {current && <BlockMesh block={current} index={blocks.length} opacity={0.95} />}
    </svg>
  );
}
