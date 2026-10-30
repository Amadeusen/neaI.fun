import Link from "next/link";
import type { CSSProperties, PropsWithChildren } from "react";
import { Logo } from "@/components/shared/Logo";
import type { GameManifest } from "@/games/types";

/**
 * Full-viewport frame shared by every game: a slim top bar (the site logo,
 * which links home, and the game's title) and a stage that takes the rest of
 * the screen, so a game never needs the page to scroll. The game's theme is
 * applied through the CSS variables defined in `src/styles/tokens.css`.
 */
export function GameScreen({
  manifest,
  children,
}: PropsWithChildren<{ manifest: GameManifest }>) {
  const themeVars = {
    "--screen-bg": manifest.theme.background,
    "--game-accent": manifest.theme.accent,
  } as CSSProperties;

  return (
    <div
      className="flex h-dvh flex-col overflow-hidden bg-screen pt-[env(safe-area-inset-top)]"
      style={themeVars}
    >
      <header className="grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 px-4">
        <Link
          href="/"
          aria-label="neaI.fun: back to all games"
          className="justify-self-start rounded-lg transition-opacity hover:opacity-70"
        >
          <Logo className="text-2xl sm:text-3xl" />
        </Link>
        <h1 className="truncate font-display text-lg font-semibold sm:text-xl">
          {manifest.title}
        </h1>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {children}
      </main>
    </div>
  );
}
