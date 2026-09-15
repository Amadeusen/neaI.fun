import { project, pointsAttr } from "./projection";

const GROUND_HALF = 600;
const FADE_START = 10;
const FADE_END = 34;

function groundOpacity(score: number): number {
  if (score <= FADE_START) return 1;
  if (score >= FADE_END) return 0;
  return 1 - (score - FADE_START) / (FADE_END - FADE_START);
}

/**
 * A flat ground plane at world z=0, projected with the exact same isometric
 * math as the tower blocks. Rendered inside the same <svg>/viewBox as the
 * tower so it always sits directly under the base, however the camera pans.
 */
export function Ground({ score }: { score: number }) {
  const opacity = groundOpacity(score);
  if (opacity <= 0) return null;

  const corners = [
    project(-GROUND_HALF, -GROUND_HALF, 0),
    project(GROUND_HALF, -GROUND_HALF, 0),
    project(GROUND_HALF, GROUND_HALF, 0),
    project(-GROUND_HALF, GROUND_HALF, 0),
  ];

  return <polygon points={pointsAttr(corners)} fill="#1d5c3a" opacity={opacity} />;
}
