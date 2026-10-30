/** Rules and color generation for Color Match. */

export const TOTAL_ROUNDS = 10;
const SWATCH_COUNT = 6;
/** Every swatch in a round is at least this many degrees of hue from every other. */
const MIN_HUE_GAP = 18;

export type Phase = "idle" | "playing" | "done";

export interface Round {
  target: string;
  options: string[];
}

/** Shortest distance between two hues on the color wheel, in degrees. */
function hueDistance(a: number, b: number): number {
  return Math.abs(((a - b + 540) % 360) - 180);
}

/** `count` random hues, all at least MIN_HUE_GAP apart (rejection sampling). */
function distinctHues(count: number): number[] {
  const hues: number[] = [];
  while (hues.length < count) {
    const hue = Math.floor(Math.random() * 360);
    if (hues.every((h) => hueDistance(h, hue) >= MIN_HUE_GAP)) hues.push(hue);
  }
  return hues;
}

/** A vivid color of the given hue: fairly saturated, mid lightness. */
function vividColor(hue: number): string {
  const saturation = 65 + Math.floor(Math.random() * 20);
  const lightness = 45 + Math.floor(Math.random() * 15);
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

/** A random target color and six shuffled options, one of which matches. */
export function buildRound(): Round {
  const options = distinctHues(SWATCH_COUNT).map(vividColor);
  const target = options[Math.floor(Math.random() * options.length)];
  return { target, options };
}
