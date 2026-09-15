import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameShell } from "@/components/game/GameShell";
import { GameLoader } from "@/components/game/GameLoader";
import { getAllSlugs, getGameBySlug } from "@/games/registry";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const manifest = getGameBySlug(slug);
  if (!manifest) return {};
  return {
    title: `${manifest.title} — Playground`,
    description: manifest.tagline,
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const manifest = getGameBySlug(slug);
  if (!manifest) notFound();

  return (
    <GameShell manifest={manifest}>
      <GameLoader slug={slug} />
    </GameShell>
  );
}
