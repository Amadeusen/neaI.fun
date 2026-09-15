"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { getAllSlugs, getGameLoader } from "@/games/registry";

function Loading() {
  return <p className="text-center text-sm text-neutral-500">Loading…</p>;
}

// Built once at module scope (not during render) so each game's chunk is
// still lazily fetched on demand, but the wrapper component identity is stable.
const dynamicComponents: Record<string, ComponentType> = Object.fromEntries(
  getAllSlugs().map((slug) => [
    slug,
    dynamic(getGameLoader(slug)!, { ssr: false, loading: Loading }),
  ]),
);

/** Client-side boundary that mounts a single game's lazily-loaded component. */
export function GameLoader({ slug }: { slug: string }) {
  const GameComponent = dynamicComponents[slug];
  if (!GameComponent) return null;
  return <GameComponent />;
}
