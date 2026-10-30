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
  /** One-line hook shown on the home page tile. */
  tagline: string;
  /** Longer blurb used for the page's meta description. */
  description: string;
  /** Single emoji used as the game's icon (keeps the project asset-free). */
  emoji: string;
  theme: GameTheme;
}
