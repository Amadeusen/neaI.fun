import type { ComponentType } from "react";

export interface GameTheme {
  /** Main brand color of the game: buttons, highlights, focus rings. */
  accent: string;
  /** Background of the game's own screen. */
  background: string;
  /** Background of the game's tile on the home page. */
  tile: string;
}

export interface GameManifest {
  /**
   * URL-safe unique identifier. Must match the route folder name,
   * i.e. the game lives at `src/app/<slug>/page.tsx` and is served at `/<slug>`.
   */
  slug: string;
  /** Short display name shown on the tile and in the game's top bar. */
  title: string;
  /** Longer blurb used for the page's meta description. */
  description: string;
  /** Single emoji icon, e.g. on a start screen (keeps the project asset-free). */
  emoji: string;
  theme: GameTheme;
}

/** What the home page needs to show one game: its data and its tile art. */
export interface GameListing {
  manifest: GameManifest;
  /** Static illustration drawn on the game's home page tile. */
  Thumbnail: ComponentType;
  /** The game's stylized title logo, also used in its top bar. */
  Title: ComponentType;
}
