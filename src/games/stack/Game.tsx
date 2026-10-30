"use client";

import { useAspectRatio } from "@/lib/useAspectRatio";
import { cameraViewBox } from "./camera";
import { DEFAULT_ASPECT } from "./constants";
import { StackBackground } from "./StackBackground";
import { StackHud } from "./StackHud";
import { StackScene } from "./StackScene";
import { useStackGame } from "./useStackGame";

/**
 * Stack: drop sliding blocks onto a tower; whatever overhangs is trimmed off.
 * This component only assembles the stage; the rules live in useStackGame.
 */
export default function Stack() {
  const game = useStackGame();
  const [stageRef, aspect] = useAspectRatio<HTMLDivElement>(DEFAULT_ASPECT);

  const playing = game.phase === "playing";
  const topIndex = playing ? game.blocks.length : game.blocks.length - 1;
  const viewBox = cameraViewBox(game.blocks, topIndex, aspect);

  return (
    <div
      ref={stageRef}
      onPointerDown={(e) => {
        if (e.button === 0) game.activate();
      }}
      className="relative h-full max-h-[780px] w-full max-w-[520px] touch-manipulation overflow-hidden rounded-[var(--radius-card)] select-none"
      aria-label="Stack game. Press space or tap to drop the block."
    >
      <StackBackground score={game.score} />
      <StackScene
        viewBox={viewBox}
        score={game.score}
        blocks={game.blocks}
        debris={game.debris}
        current={playing ? game.current : null}
      />
      <StackHud
        phase={game.phase}
        score={game.score}
        best={game.best}
        isNewBest={game.isNewBest}
        onRestart={game.start}
      />
    </div>
  );
}
