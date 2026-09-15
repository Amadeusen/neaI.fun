import Link from "next/link";
import type { PropsWithChildren } from "react";
import type { GameManifest } from "@/games/types";
import { Container } from "@/components/ui/Container";
import { GameCover } from "@/components/shared/GameCover";

export function GameShell({
  manifest,
  children,
}: PropsWithChildren<{ manifest: GameManifest }>) {
  return (
    <Container className="flex flex-col gap-8 py-10">
      <div>
        <Link href="/" className="text-sm text-neutral-500 hover:underline">
          ← All games
        </Link>

        <GameCover
          seed={manifest.slug}
          accentColor={manifest.accentColor}
          emoji={manifest.emoji}
          emojiClassName="text-6xl"
          className="mt-4 aspect-[3/1] w-full rounded-2xl sm:aspect-[4/1]"
        />

        <h1 className="font-display mt-4 text-2xl font-bold">
          {manifest.title}
        </h1>
        <p className="mt-1 max-w-prose text-neutral-600 dark:text-neutral-400">
          {manifest.description}
        </p>
      </div>

      <div
        className="rounded-2xl border border-black/5 bg-white/60 p-6 backdrop-blur-sm sm:p-10 dark:border-white/10 dark:bg-white/5"
        style={
          {
            "--game-accent": manifest.accentColor,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </Container>
  );
}
