import Link from "next/link";
import type { CSSProperties } from "react";
import type { GameListing } from "@/games/types";

/**
 * A square, flat, rounded tile linking to one game: its title in the corner
 * and its illustration filling the rest, tinted with the game's theme.
 * Thumbnails can read the accent color through `--tile-accent`.
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
      className="group relative block aspect-square overflow-hidden rounded-[var(--radius-tile)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.04)] transition-transform duration-200 hover:-translate-y-1 active:translate-y-0"
      style={style}
    >
      <div className="absolute inset-x-0 bottom-0 top-[14%]">
        <Thumbnail />
      </div>

      <h2
        className="absolute top-3 left-4 font-display text-xl leading-tight font-bold sm:top-4 sm:left-5 sm:text-2xl"
        style={{ color: manifest.theme.accent }}
      >
        {manifest.title}
      </h2>
    </Link>
  );
}
