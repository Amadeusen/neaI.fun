import { GameTile } from "@/components/home/GameTile";
import { games } from "@/games/registry";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[900px] px-4 pt-10 pb-16 sm:pt-16">
      <header className="mb-10 text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
          neaI<span className="text-ink-muted">.fun</span>
        </h1>
        <p className="mt-3 text-ink-muted">Tiny interactive things to poke at.</p>
      </header>

      <ul className="grid grid-cols-1 gap-x-[18px] gap-y-[15px] sm:grid-cols-2">
        {games.map((game) => (
          <li key={game.slug}>
            <GameTile game={game} />
          </li>
        ))}
      </ul>

      <footer className="mt-14 text-center text-sm text-ink-muted">
        More things on the way.
      </footer>
    </main>
  );
}
