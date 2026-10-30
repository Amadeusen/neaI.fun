import type { CSSProperties } from "react";
import { BlockMesh } from "./BlockMesh";
import { BLOCK_HEIGHT } from "./constants";
import { Ground } from "./Ground";
import type { Block, Debris } from "./types";

/** The isometric world: island, placed tower, falling debris and the sliding block. */
export function StackScene({
  viewBox,
  score,
  blocks,
  debris,
  current,
}: {
  viewBox: string;
  score: number;
  blocks: Block[];
  debris: Debris[];
  /** The sliding block, or null when nothing is in flight. */
  current: Block | null;
}) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox={viewBox} aria-hidden>
      <Ground score={score} />

      {blocks.map((block, i) => (
        <BlockMesh key={i} block={block} index={i} />
      ))}

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
