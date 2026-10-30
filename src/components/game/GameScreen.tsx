import Link from "next/link";
import type { CSSProperties, PropsWithChildren } from "react";
import type { GameManifest } from "@/games/types";

/**
 * Full-viewport frame shared by every game: a slim top bar (back arrow and
 * title) and a stage that takes the rest of the screen, so a game never
 * needs the page to scroll. The game's theme is applied through the CSS
 * variables defined in `src/styles/tokens.css`.
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
      <header className="relative flex h-14 shrink-0 items-center justify-center px-16">
        <Link
          href="/"
          aria-label="Back to all games"
          className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full transition-colors hover:bg-black/5"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="truncate font-display text-xl font-semibold">{manifest.title}</h1>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {children}
      </main>
    </div>
  );
}
