import { useCallback, useRef, useState } from "react";
import { BLOCK_HEIGHT } from "./constants";
import { blockScreenCenter } from "./geometry";
import type { Block, Debris } from "./types";

/** Matches the `debris-fall-3d` animation in src/styles/animations.css. */
const DEBRIS_LIFETIME_MS = 550;

/** Picks a fall trajectory that drifts the piece away from the tower's center. */
function fallTrajectory(piece: Block, layerIndex: number) {
  const [screenX] = blockScreenCenter(piece, layerIndex);
  const side = screenX >= 0 ? 1 : -1;
  return {
    fallX: side * (18 + Math.random() * 16),
    fallY: 55 + Math.random() * 30,
    fallRotate: side * (16 + Math.random() * 22),
  };
}

/** Trimmed-off pieces that fall away and remove themselves once animated. */
export function useDebris() {
  const [debris, setDebris] = useState<Debris[]>([]);
  const nextId = useRef(0);

  const spawnDebris = useCallback((pieces: Block[], layerIndex: number) => {
    if (!pieces.length) return;
    const bottom = layerIndex * BLOCK_HEIGHT;
    const newPieces: Debris[] = pieces.map((piece) => ({
      ...piece,
      id: nextId.current++,
      bottom,
      ...fallTrajectory(piece, layerIndex),
    }));
    setDebris((d) => [...d, ...newPieces]);
    newPieces.forEach((piece) => {
      window.setTimeout(() => {
        setDebris((d) => d.filter((p) => p.id !== piece.id));
      }, DEBRIS_LIFETIME_MS);
    });
  }, []);

  const clearDebris = useCallback(() => setDebris([]), []);

  return { debris, spawnDebris, clearDebris };
}
