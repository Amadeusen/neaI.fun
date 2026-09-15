import Link from "next/link";
import type { PropsWithChildren } from "react";
import type { GameManifest } from "@/games/types";
import { Container } from "@/components/ui/Container";

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
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold">
          <span>{manifest.emoji}</span>
          {manifest.title}
        </h1>
        <p className="mt-1 max-w-prose text-neutral-600 dark:text-neutral-400">
          {manifest.description}
        </p>
      </div>

      <div
        className="rounded-2xl border border-black/5 p-6 sm:p-10 dark:border-white/10"
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
