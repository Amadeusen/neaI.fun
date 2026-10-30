import type { GameManifest } from "./types";
import { manifest as clickSprint } from "./click-sprint/manifest";
import { manifest as colorMatch } from "./color-match/manifest";
import { manifest as stack } from "./stack/manifest";

/**
 * Every game listed on the home page, in display order.
 *
 * Only manifests live here (cheap, synchronous data). Each game's code is
 * imported solely by its own route in `src/app/<slug>/page.tsx`, so Next.js
 * code-splits it and the home page never downloads any game.
 */
export const games: GameManifest[] = [stack, clickSprint, colorMatch];
