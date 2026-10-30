import Link from "next/link";
import type { CSSProperties } from "react";
import type { GameListing } from "@/games/types";

/**
 * A wide, flat, rounded tile linking to one game: its title set large on the
 * left and its illustration filling the background on the right, tinted with
 * the game's theme. Thumbnails can read the accent color through
 * `--tile-accent`.
 */
export function GameTile({ game }: { game: GameListing }) {
  const { manifest, Thumbnail } = game;
  const style = {
    background: manifest.theme.tile,
    "--tile-accent": manifest.theme.accent,
  } as CSSProperties;

  return (
    <Link
      href={`/${manifest.slug}`}
      className="group relative flex aspect-[16/9] items-center overflow-hidden rounded-[var(--radius-tile)] px-5 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.04)] transition-transform duration-200 hover:-translate-y-1 active:translate-y-0"
      style={style}
    >
      <div className="absolute inset-y-0 right-0 aspect-square">
        <Thumbnail />
      </div>

      <h2
        className="relative max-w-[55%] font-display text-4xl leading-[0.95] font-bold drop-shadow-[0_2px_0_rgb(255_255_255/0.6)]"
        style={{ color: manifest.theme.accent }}
      >
        {manifest.title}
      </h2>
    </Link>
  );
}
