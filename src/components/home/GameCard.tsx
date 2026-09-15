import Link from "next/link";
import type { GameManifest } from "@/games/types";
import { GameCover } from "@/components/shared/GameCover";

export function GameCard({ game }: { game: GameManifest }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white/60 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
    >
      <GameCover
        seed={game.slug}
        accentColor={game.accentColor}
        emoji={game.emoji}
        className="aspect-[16/9] w-full transition-transform duration-300 group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col gap-1 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold">{game.title}</h2>
          <span
            aria-hidden
            className="translate-x-0 text-sm opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
          >
            →
          </span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {game.tagline}
        </p>
      </div>
    </Link>
  );
}
