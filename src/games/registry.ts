import type { GameListing } from "./types";
import { manifest as clickSprint } from "./click-sprint/manifest";
import { ClickSprintThumbnail } from "./click-sprint/Thumbnail";
import { ClickSprintTitle } from "./click-sprint/Title";
import { manifest as colorMatch } from "./color-match/manifest";
import { ColorMatchThumbnail } from "./color-match/Thumbnail";
import { ColorMatchTitle } from "./color-match/Title";
import { manifest as stack } from "./stack/manifest";
import { StackThumbnail } from "./stack/Thumbnail";
import { StackTitle } from "./stack/Title";

/**
 * Every game listed on the home page, in display order.
 *
 * Only manifests, tile art and title logos live here. Thumbnails and titles
 * are server components rendered to static HTML, so they ship no JavaScript. Each game's actual
 * code is imported solely by its own route in `src/app/<slug>/page.tsx`, so
 * Next.js code-splits it and the home page never downloads any game.
 */
export const games: GameListing[] = [
  { manifest: stack, Thumbnail: StackThumbnail, Title: StackTitle },
  { manifest: clickSprint, Thumbnail: ClickSprintThumbnail, Title: ClickSprintTitle },
  { manifest: colorMatch, Thumbnail: ColorMatchThumbnail, Title: ColorMatchTitle },
];
