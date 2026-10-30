import type { GameManifest } from "../types";

export const manifest: GameManifest = {
  slug: "color-match",
  title: "Color Match",
  description:
    "Pick the swatch that matches the target color. After level 10 the grid keeps growing and the shades get closer and closer, like a color-vision test. One wrong pick ends the run.",
  emoji: "🎨",
  theme: {
    accent: "#7c5cff",
    background: "#f4f1ff",
    tile: "#e4ddff",
  },
};
