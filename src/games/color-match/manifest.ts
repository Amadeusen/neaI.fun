import type { GameManifest } from "../types";

export const manifest: GameManifest = {
  slug: "color-match",
  title: "Color Match",
  description:
    "Pick the swatch that matches the target color before the clock runs out. Every right pick adds 5 seconds; three wrong picks and you are out. The grid keeps growing and the shades get closer and closer, like a color-vision test.",
  emoji: "🎨",
  theme: {
    accent: "#7c5cff",
    background: "#f4f1ff",
    tile: "#e4ddff",
  },
};
