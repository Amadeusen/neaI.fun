import Link from "next/link";
import type { GameManifest } from "@/games/types";

export function GameCard({ game }: { game: GameManifest }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex flex-col justify-between gap-4 rounded-2xl border border-black/5 p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-white/10"
      style={{ backgroundColor: `${game.accentColor}1a` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-3xl">{game.emoji}</span>
        <span
          aria-hidden
          className="translate-x-0 text-sm opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
        >
          →
        </span>
      </div>
      <div>
        <h2 className="font-semibold">{game.title}</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {game.tagline}
        </p>
      </div>
    </Link>
  );
}
