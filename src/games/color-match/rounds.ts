/** Rules and color generation for Color Match. */

export const TOTAL_ROUNDS = 10;
const SWATCH_COUNT = 6;
/** Distractors stay at least this many degrees of hue away from the target. */
const MIN_HUE_GAP = 18;

export type Phase = "idle" | "playing" | "done";

export interface Round {
  target: string;
  options: string[];
}

function randomHsl(avoidHue?: number): string {
  let hue = Math.floor(Math.random() * 360);
  if (avoidHue !== undefined) {
    const gap = Math.abs(((hue - avoidHue + 540) % 360) - 180);
    if (gap < MIN_HUE_GAP) hue = (hue + 2 * MIN_HUE_GAP) % 360;
  }
  const saturation = 65 + Math.floor(Math.random() * 20);
  const lightness = 45 + Math.floor(Math.random() * 15);
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

/** A random target color and six shuffled options, one of which matches. */
export function buildRound(): Round {
  const target = randomHsl();
  const targetHue = Number(target.slice(4).split(" ")[0]);
  const options = [target];
  while (options.length < SWATCH_COUNT) {
    options.push(randomHsl(targetHue));
  }
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { target, options };
}
