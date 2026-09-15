import type { GameEntry, GameManifest } from "./types";
import { manifest as clickSprintManifest } from "./click-sprint/manifest";
import { manifest as colorMatchManifest } from "./color-match/manifest";

/**
 * Single source of truth for every mini-game in the app.
 *
 * To add a new game:
 *   1. Create `src/games/<slug>/manifest.ts` exporting a `manifest: GameManifest`.
 *   2. Create `src/games/<slug>/Game.tsx` with a default-exported React component.
 *   3. Add one entry below, importing the manifest and lazily loading the component.
 *
 * The home page only ever touches `manifest` data (cheap, synchronous), while
 * `load()` is only called by the individual game route, so each game's code
 * is code-split and never bundled into the home page.
 */
const registry: GameEntry[] = [
  {
    manifest: clickSprintManifest,
    load: () => import("./click-sprint/Game"),
  },
  {
    manifest: colorMatchManifest,
    load: () => import("./color-match/Game"),
  },
];

export function getAllGames(): GameManifest[] {
  return registry.map((entry) => entry.manifest);
}

export function getAllSlugs(): string[] {
  return registry.map((entry) => entry.manifest.slug);
}

export function getGameBySlug(slug: string): GameManifest | undefined {
  return registry.find((entry) => entry.manifest.slug === slug)?.manifest;
}

export function getGameLoader(slug: string): GameEntry["load"] | undefined {
  return registry.find((entry) => entry.manifest.slug === slug)?.load;
}
