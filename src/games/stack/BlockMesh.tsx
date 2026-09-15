import { manifest } from "./manifest";
import { hexToHsl, hsl, pointsAttr } from "./projection";
import { faces } from "./geometry";
import { BLOCK_HEIGHT, HUE_STEP } from "./constants";
import type { Block } from "./types";

const [ACCENT_HUE, ACCENT_SAT, ACCENT_LIGHT] = hexToHsl(manifest.accentColor);

/** Renders one block as three shaded isometric faces; hue rotates with layer index. */
export function BlockMesh({
  block,
  index,
  opacity = 1,
}: {
  block: Block;
  index: number;
  opacity?: number;
}) {
  const z0 = index * BLOCK_HEIGHT;
  const f = faces(block, z0, z0 + BLOCK_HEIGHT);
  const hue = ACCENT_HUE + index * HUE_STEP;

  return (
    <g opacity={opacity}>
      <polygon points={pointsAttr(f.left)} fill={hsl(hue, ACCENT_SAT, ACCENT_LIGHT - 24)} />
      <polygon points={pointsAttr(f.right)} fill={hsl(hue, ACCENT_SAT, ACCENT_LIGHT - 6)} />
      <polygon points={pointsAttr(f.top)} fill={hsl(hue, ACCENT_SAT, ACCENT_LIGHT + 20)} />
    </g>
  );
}
