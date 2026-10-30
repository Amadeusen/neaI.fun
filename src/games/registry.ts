import type { GameListing } from "./types";
import { manifest as clickSprint } from "./click-sprint/manifest";
import { ClickSprintThumbnail } from "./click-sprint/Thumbnail";
import { manifest as colorMatch } from "./color-match/manifest";
import { ColorMatchThumbnail } from "./color-match/Thumbnail";
import { manifest as stack } from "./stack/manifest";
import { StackThumbnail } from "./stack/Thumbnail";

/**
 * Every game listed on the home page, in display order.
 *
 * Only manifests and tile art live here. Thumbnails are server components
 * rendered to static HTML, so they ship no JavaScript. Each game's actual
 * code is imported solely by its own route in `src/app/<slug>/page.tsx`, so
 * Next.js code-splits it and the home page never downloads any game.
 */
export const games: GameListing[] = [
  { manifest: stack, Thumbnail: StackThumbnail },
  { manifest: clickSprint, Thumbnail: ClickSprintThumbnail },
  { manifest: colorMatch, Thumbnail: ColorMatchThumbnail },
];
