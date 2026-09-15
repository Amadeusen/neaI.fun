import type { ComponentType } from "react";

export interface GameManifest {
  /** URL-safe unique identifier, also used as the route segment (/games/[slug]). */
  slug: string;
  /** Short display name shown on the card and game page. */
  title: string;
  /** One-line hook shown on the home page card. */
  tagline: string;
  /** Longer blurb shown on the game's own page. */
  description: string;
  /** Hex color used to tint the card and page accents. */
  accentColor: string;
  /** Single emoji used as the game's icon (keeps the project asset-free). */
  emoji: string;
  /** Freeform tags for future filtering/search. */
  tags: string[];
}

export type GameComponentLoader = () => Promise<{ default: ComponentType }>;

export interface GameEntry {
  manifest: GameManifest;
  load: GameComponentLoader;
}
