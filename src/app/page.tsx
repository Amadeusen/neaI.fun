import { Container } from "@/components/ui/Container";
import { GameGrid } from "@/components/home/GameGrid";
import { getAllGames } from "@/games/registry";

export default function Home() {
  const games = getAllGames();

  return (
    <Container className="flex flex-col gap-10 py-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          A handful of tiny interactive things.
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          Small self-contained experiments and mini-games. Pick one below.
        </p>
      </div>

      <GameGrid games={games} />
    </Container>
  );
}
