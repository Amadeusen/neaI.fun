import type { GameManifest } from "../types";

export const manifest: GameManifest = {
  slug: "color-match",
  title: "Color Match",
  tagline: "Spot the matching swatch, ten rounds in a row.",
  description:
    "A target color flashes on screen. Pick the matching swatch from the grid as fast as you can across 10 rounds. One wrong pick ends the run.",
  emoji: "🎨",
  theme: {
    accent: "#7c5cff",
    background: "#f4f1ff",
    tile: "#e4ddff",
  },
};
