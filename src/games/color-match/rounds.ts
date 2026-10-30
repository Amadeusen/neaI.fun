/**
 * Rules and color generation for Color Match.
 *
 * The run is endless; level N is won by picking the swatch that matches the
 * target. Levels before HARD_FROM use a small grid of clearly different
 * hues. From HARD_FROM on, the grid grows by one row and column every
 * LEVELS_PER_SIZE levels, and every swatch is a slight variation of the
 * target that gets subtler each level, like a color-vision test.
 */

export type Phase = "idle" | "playing" | "done";

export interface Round {
  cols: number;
  rows: number;
  target: string;
  options: string[];
}

export const HARD_FROM = 10;
const LEVELS_PER_SIZE = 5;
const FIRST_HARD_SIZE = 4;
const MAX_SIZE = 8;

/** Easy levels: every swatch at least this many degrees of hue from every other. */
const MIN_HUE_GAP = 18;
/** Hard levels: how far distractors sit from the target, shrinking per level. */
const START_DELTA = 12;
const DELTA_STEP = 0.4;
const MIN_DELTA = 3;

/** Grid dimensions for a level. */
export function gridFor(level: number): { cols: number; rows: number } {
  if (level < HARD_FROM) return { cols: 3, rows: 2 };
  const size = FIRST_HARD_SIZE + Math.floor((level - HARD_FROM) / LEVELS_PER_SIZE);
  const capped = Math.min(MAX_SIZE, size);
  return { cols: capped, rows: capped };
}

/** True on the first level of each grid size, to announce the change. */
export function isNewGridLevel(level: number): boolean {
  return level >= HARD_FROM && (level - HARD_FROM) % LEVELS_PER_SIZE === 0;
}

const random = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const hsl = (h: number, s: number, l: number) =>
  `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;

/** Shortest distance between two hues on the color wheel, in degrees. */
function hueDistance(a: number, b: number): number {
  return Math.abs(((a - b + 540) % 360) - 180);
}

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Levels 1-9: vivid colors with clearly different hues. */
function easyOptions(count: number): string[] {
  const hues: number[] = [];
  while (hues.length < count) {
    const hue = Math.floor(Math.random() * 360);
    if (hues.every((h) => hueDistance(h, hue) >= MIN_HUE_GAP)) hues.push(hue);
  }
  return hues.map((h) => hsl(h, random(65, 85), random(45, 60)));
}

/**
 * Hard levels: the target plus distractors offset from it by exactly
 * `delta` in a random direction of (hue, saturation, lightness), so none can
 * be mistaken for an exact match but all look alike at a glance.
 */
function hardOptions(count: number, level: number): { target: string; options: string[] } {
  const delta = Math.max(MIN_DELTA, START_DELTA - (level - HARD_FROM) * DELTA_STEP);
  const [h, s, l] = [random(0, 360), random(55, 75), random(45, 60)];
  const target = hsl(h, s, l);

  const options = [target];
  while (options.length < count) {
    const [x, y, z] = [random(-1, 1), random(-1, 1), random(-1, 1)];
    const norm = Math.hypot(x, y, z) || 1;
    options.push(
      hsl(
        h + (x / norm) * delta * 1.5,
        clamp(s + (y / norm) * delta, 0, 100),
        clamp(l + (z / norm) * delta, 0, 100),
      ),
    );
  }
  return { target, options: shuffle(options) };
}

/** Builds the grid for a level: one swatch exactly matches `target`. */
export function buildRound(level: number): Round {
  const { cols, rows } = gridFor(level);
  const count = cols * rows;

  if (level < HARD_FROM) {
    const options = easyOptions(count);
    return { cols, rows, target: options[Math.floor(Math.random() * count)], options };
  }
  return { cols, rows, ...hardOptions(count, level) };
}
