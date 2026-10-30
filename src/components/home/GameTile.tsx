import Link from "next/link";
import type { CSSProperties } from "react";
import type { GameListing } from "@/games/types";

/**
 * A wide, flat, rounded tile linking to one game: its title logo in the
 * top-left corner and its illustration filling the background on the right,
 * tinted with the game's theme. Thumbnails can read the accent color through
 * `--tile-accent`; title logos read it through `--game-accent`, as in the
 * game's own top bar.
 */
export function GameTile({ game }: { game: GameListing }) {
  const { manifest, Thumbnail, Title } = game;
  const style = {
    background: manifest.theme.tile,
    "--tile-accent": manifest.theme.accent,
    "--game-accent": manifest.theme.accent,
  } as CSSProperties;

  return (
    <Link
      href={`/${manifest.slug}`}
      className="group relative flex aspect-[16/9] items-center overflow-hidden rounded-[var(--radius-tile)] px-5 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.04)] transition-transform duration-200 hover:-translate-y-1 active:translate-y-0"
      style={style}
    >
      <div className="absolute right-2 bottom-0 aspect-square h-[76%] transition-transform duration-300 group-hover:scale-105">
        <Thumbnail />
      </div>

      <h2 aria-label={manifest.title} className="absolute top-4 left-4 origin-top-left scale-[0.8] transition-transform duration-300 group-hover:scale-[0.86]">
        <Title />
      </h2>
    </Link>
  );
}
