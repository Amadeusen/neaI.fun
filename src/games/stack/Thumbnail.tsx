import { BlockMesh } from "./BlockMesh";
import { Ground } from "./Ground";
import type { Block } from "./types";

// A frozen moment of a run: a few trimmed layers and one piece mid-slide,
// drawn with the game's own projection and meshes.
const TOWER: Block[] = [
  { x: 29, y: 29, width: 92, depth: 92 },
  { x: 35, y: 29, width: 86, depth: 92 },
  { x: 35, y: 34, width: 86, depth: 84 },
  { x: 41, y: 34, width: 80, depth: 84 },
  { x: 41, y: 39, width: 80, depth: 79 },
];
const SLIDING: Block = { x: 66, y: 39, width: 80, depth: 79 };

/** Home page tile art for Stack (static SVG, no client JS). */
export function StackThumbnail() {
  return (
    <svg viewBox="-185 -205 370 370" className="h-full w-full" aria-hidden>
      {/* Drifting clouds. */}
      <g fill="#fff" className="transition-transform duration-700 group-hover:translate-x-3">
        <ellipse cx="-110" cy="-170" rx="34" ry="12" opacity="0.8" />
        <ellipse cx="-90" cy="-180" rx="20" ry="10" opacity="0.8" />
        <ellipse cx="115" cy="-125" rx="28" ry="9" opacity="0.6" />
      </g>
      <g className="origin-center transition-transform duration-500 group-hover:-translate-y-2">
        <Ground score={0} />
        {TOWER.map((block, i) => (
          <BlockMesh key={i} block={block} index={i} />
        ))}
        <g className="transition-transform duration-500 group-hover:-translate-x-6">
          <BlockMesh block={SLIDING} index={TOWER.length} opacity={0.95} />
        </g>
      </g>
    </svg>
  );
}
