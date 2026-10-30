import type { Metadata } from "next";
import type { GameManifest } from "./types";

/** Page metadata for a game route, derived from its manifest. */
export function gameMetadata(manifest: GameManifest): Metadata {
  return {
    title: `${manifest.title} · neaI.fun`,
    description: manifest.description,
  };
}
