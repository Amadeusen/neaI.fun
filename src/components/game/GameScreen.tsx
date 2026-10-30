import Link from "next/link";
import type { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { Logo } from "@/components/shared/Logo";
import type { GameManifest } from "@/games/types";

/**
 * Full-viewport frame shared by every game: a top bar (the site logo, which
 * links home, and the game's own title logo) and a stage that takes the rest
 * of the screen, so a game never needs the page to scroll. The game's theme
 * is applied through the CSS variables defined in `src/styles/tokens.css`.
 */
export function GameScreen({
  manifest,
  title,
  children,
}: PropsWithChildren<{
  manifest: GameManifest;
  /** The game's stylized title (its `Title.tsx`); purely decorative. */
  title: ReactNode;
}>) {
  const themeVars = {
    "--screen-bg": manifest.theme.background,
    "--game-accent": manifest.theme.accent,
  } as CSSProperties;

  return (
    <div
      className="flex h-dvh flex-col overflow-hidden bg-screen pt-[env(safe-area-inset-top)]"
      style={themeVars}
    >
      <header className="grid h-20 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:h-24 sm:px-5">
        <Link
          href="/"
          aria-label="neaI.fun: back to all games"
          className="justify-self-start rounded-lg transition-[opacity,transform] hover:-translate-x-0.5 hover:opacity-70"
        >
          <Logo className="text-lg sm:text-3xl" />
        </Link>
        <h1 aria-label={manifest.title}>{title}</h1>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {children}
      </main>
    </div>
  );
}
