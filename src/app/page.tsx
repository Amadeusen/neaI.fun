import { GameTile } from "@/components/home/GameTile";
import { Logo } from "@/components/shared/Logo";
import { games } from "@/games/registry";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[960px] px-4 pt-10 pb-16 sm:pt-16">
      <header className="mb-10 text-center">
        <h1>
          <Logo className="text-5xl sm:text-6xl" />
        </h1>
        <p className="mt-3 text-ink-muted">Games and stuff</p>
      </header>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {games.map((game) => (
          <li key={game.manifest.slug}>
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
