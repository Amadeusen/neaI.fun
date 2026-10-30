/**
 * Rules and color generation for Color Match.
 *
 * The run is endless; level N is won by picking the swatch that exactly
 * matches the target. Difficulty rises smoothly on two axes:
 *
 * - the grid grows step by step (GRID_STEPS), and
 * - from VARIATIONS_FROM on, every swatch is a variation of the target whose
 *   distance (`delta`) shrinks exponentially with the level, so early
 *   levels are relaxed and the late game becomes a color-vision test.
 */

/** "reveal": the run just ended and the answer is shown before the results. */
export type Phase = "idle" | "playing" | "reveal" | "done";

export interface Round {
  cols: number;
  rows: number;
  target: string;
  options: string[];
}

/** Grid size by level: each step applies from its `from` level onward. */
const GRID_STEPS = [
  { from: 1, cols: 3, rows: 2 },
  { from: 6, cols: 3, rows: 3 },
  { from: 13, cols: 4, rows: 4 },
  { from: 27, cols: 5, rows: 5 },
  { from: 37, cols: 6, rows: 6 },
  { from: 47, cols: 7, rows: 7 },
  { from: 57, cols: 8, rows: 8 },
];

/** Before this level, swatches are simply different hues. */
export const VARIATIONS_FROM = 6;
/** Easy levels: every swatch at least this many degrees of hue from every other. */
const MIN_HUE_GAP = 18;
/** Variation distance: starts wide, decays toward MIN_DELTA (≈11.6 at level 25). */
const START_DELTA = 60;
const MIN_DELTA = 2.5;
const DECAY_LEVELS = 13;

export function gridFor(level: number): { cols: number; rows: number } {
  const step = [...GRID_STEPS].reverse().find((s) => level >= s.from)!;
  return { cols: step.cols, rows: step.rows };
}

/** True on the first level of each bigger grid, to announce it. */
export function isNewGridLevel(level: number): boolean {
  return level > 1 && GRID_STEPS.some((s) => s.from === level);
}

/** How far distractors sit from the target at a level (HSL units). */
export function deltaFor(level: number): number {
  return MIN_DELTA + (START_DELTA - MIN_DELTA) * Math.exp(-(level - 1) / DECAY_LEVELS);
}

const random = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const hsl = (h: number, s: number, l: number) =>
  `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;

function hueDistance(a: number, b: number): number {
  return Math.abs(((a - b + 540) % 360) - 180);
}

/** Early levels: vivid colors with clearly different hues. */
function distinctOptions(count: number): string[] {
  const hues: number[] = [];
  while (hues.length < count) {
    const hue = Math.floor(Math.random() * 360);
    if (hues.every((h) => hueDistance(h, hue) >= MIN_HUE_GAP)) hues.push(hue);
  }
  return hues.map((h) => hsl(h, random(65, 85), random(45, 60)));
}

/**
 * Later levels: the target plus distractors offset from it by `delta` in a
 * random direction of (hue, saturation, lightness). Hue moves twice as far
 * as the others, and saturation / lightness offsets are capped so wide early
 * deltas don't wash colors out to white or black.
 */
function variationOptions(count: number, level: number) {
  const delta = deltaFor(level);
  const [h, s, l] = [random(0, 360), random(55, 75), random(45, 60)];
  const target = hsl(h, s, l);

  const options = [target];
  while (options.length < count) {
    const [x, y, z] = [random(-1, 1), random(-1, 1), random(-1, 1)];
    const norm = Math.hypot(x, y, z) || 1;
    options.push(
      hsl(
        h + (x / norm) * delta * 2,
        clamp(s + (y / norm) * Math.min(delta, 25), 0, 100),
        clamp(l + (z / norm) * Math.min(delta, 18), 0, 100),
      ),
    );
  }
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { target, options };
}

/** Builds the grid for a level: exactly one swatch matches `target`. */
export function buildRound(level: number): Round {
  const { cols, rows } = gridFor(level);
  const count = cols * rows;

  if (level < VARIATIONS_FROM) {
    const options = distinctOptions(count);
    return { cols, rows, target: options[Math.floor(Math.random() * count)], options };
  }
  return { cols, rows, ...variationOptions(count, level) };
}
