import Link from "next/link";
import type { GameManifest } from "@/games/types";

/** A big, flat, rounded tile linking to one game, tinted with its theme. */
export function GameTile({ game }: { game: GameManifest }) {
  return (
    <Link
      href={`/${game.slug}`}
      className="group relative flex h-36 items-center overflow-hidden rounded-[var(--radius-tile)] px-6 transition-transform duration-200 hover:-translate-y-1 active:translate-y-0"
      style={{ background: game.theme.tile }}
    >
      <div className="relative z-10 max-w-[65%]">
        <h2
          className="font-display text-3xl leading-none font-bold"
          style={{ color: game.theme.accent }}
        >
          {game.title}
        </h2>
        <p className="mt-2 text-sm leading-snug text-ink/70">{game.tagline}</p>
      </div>

      <span
        aria-hidden
        className="absolute -right-2 bottom-[-0.15em] rotate-[-8deg] text-[6.5rem] leading-none transition-transform duration-300 group-hover:scale-110 group-hover:rotate-0"
      >
        {game.emoji}
      </span>
    </Link>
  );
}
