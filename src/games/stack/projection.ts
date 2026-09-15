const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

export type Point = [number, number];

/** Standard isometric projection: world (x, y-depth, z-up) -> 2D screen point. */
export function project(x: number, y: number, z: number): Point {
  return [(x - y) * COS30, (x + y) * SIN30 - z];
}

/** Mixes a hex color toward black (negative percent) or white (positive). */
export function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const target = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const mix = (channel: number) => Math.round((target - channel) * p + channel);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export function pointsAttr(points: Point[]): string {
  return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}
