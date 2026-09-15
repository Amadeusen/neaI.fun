import type { GameManifest } from "@/games/types";
import { GameCard } from "./GameCard";

export function GameGrid({ games }: { games: GameManifest[] }) {
  if (games.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        No games yet — add one under <code>src/games</code>.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <GameCard key={game.slug} game={game} />
      ))}
    </div>
  );
}
