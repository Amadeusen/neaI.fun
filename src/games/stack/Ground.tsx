import { project, pointsAttr } from "./projection";

/** Half-width of the grassy island, in world units (the play area is ±75). */
const ISLAND_HALF = 100;
/** How far the island's soil sides hang below the grass. */
const ISLAND_DEPTH = 36;
const FADE_START = 10;
const FADE_END = 34;

function groundOpacity(score: number): number {
  if (score <= FADE_START) return 1;
  if (score >= FADE_END) return 0;
  return 1 - (score - FADE_START) / (FADE_END - FADE_START);
}

/**
 * A small floating island at world z=0, projected with the exact same
 * isometric math as the tower blocks. Rendered inside the same <svg>/viewBox
 * as the tower so it always sits directly under the base, however the camera
 * pans, and leaves the sky visible around it.
 */
export function Ground({ score }: { score: number }) {
  const opacity = groundOpacity(score);
  if (opacity <= 0) return null;

  const h = ISLAND_HALF;
  const top = [project(-h, -h, 0), project(h, -h, 0), project(h, h, 0), project(-h, h, 0)];
  const right = [project(h, -h, 0), project(h, h, 0), project(h, h, -ISLAND_DEPTH), project(h, -h, -ISLAND_DEPTH)];
  const left = [project(h, h, 0), project(-h, h, 0), project(-h, h, -ISLAND_DEPTH), project(h, h, -ISLAND_DEPTH)];

  return (
    <g opacity={opacity}>
      <polygon points={pointsAttr(left)} fill="#8a5a3b" />
      <polygon points={pointsAttr(right)} fill="#a86f48" />
      <polygon points={pointsAttr(top)} fill="#7ccf6b" />
    </g>
  );
}
